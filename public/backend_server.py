"""
WARESPY Backend — FastAPI + YOLOv8 + IoU Tracker
=================================================
Run this on your machine alongside the React dashboard.

Usage:
  pip install fastapi uvicorn opencv-python-headless ultralytics numpy
  python backend_server.py

Then set BACKEND_URL in the React dashboard to ws://localhost:8765/ws/live
"""

import asyncio
import json
import time
from dataclasses import dataclass, field
from typing import Dict, List, Tuple, Optional

import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import uvicorn

try:
    from ultralytics import YOLO
except ImportError:
    print("WARNING: ultralytics not installed. Install with: pip install ultralytics")
    YOLO = None


# =========================
# Config
# =========================
PERSON_CLASS_ID = 0

@dataclass
class Config:
    video_path: str = "sample.mp4"
    model_name: str = "yolov8n.pt"
    conf_thres: float = 0.35
    iou_match_thres: float = 0.3
    idle_px_thresh: float = 5.0
    idle_secs_trigger: float = 8.0
    repeat_events_N: int = 6
    repeat_window_secs: float = 600.0
    fatigue_low: int = 39
    fatigue_med: int = 69
    w_idle: float = 0.35
    w_repeat: float = 0.45
    w_low_activity: float = 0.20
    process_every_n_frames: int = 2
    resize_width: int = 960
    max_fps: int = 15

CFG = Config()


# =========================
# Helpers
# =========================
def resize_keep_aspect(frame, width):
    h, w = frame.shape[:2]
    if w == width:
        return frame
    scale = width / float(w)
    return cv2.resize(frame, (width, int(h * scale)), interpolation=cv2.INTER_LINEAR)

def iou_xyxy(a, b):
    x1 = max(float(a[0]), float(b[0]))
    y1 = max(float(a[1]), float(b[1]))
    x2 = min(float(a[2]), float(b[2]))
    y2 = min(float(a[3]), float(b[3]))
    inter = max(0.0, x2 - x1) * max(0.0, y2 - y1)
    area_a = max(0.0, float(a[2]-a[0])) * max(0.0, float(a[3]-a[1]))
    area_b = max(0.0, float(b[2]-b[0])) * max(0.0, float(b[3]-b[1]))
    return inter / (area_a + area_b - inter + 1e-9)

def centroid_xyxy(box):
    return (float(box[0] + box[2]) / 2.0, float(box[1] + box[3]) / 2.0)

def clamp(v, lo, hi):
    return max(lo, min(hi, v))


# =========================
# Track + Tracker
# =========================
@dataclass
class Track:
    track_id: int
    box: np.ndarray
    last_seen_ts: float
    last_centroid: Tuple[float, float]
    speed_px_per_s: float = 0.0
    idle_started_ts: Optional[float] = None
    total_idle_secs: float = 0.0
    risk_event_ts: List[float] = field(default_factory=list)
    movement_history: List[Tuple[float, float]] = field(default_factory=list)

class IoUTracker:
    def __init__(self, iou_thres=0.3, max_lost_secs=2.0):
        self.iou_thres = iou_thres
        self.max_lost_secs = max_lost_secs
        self.next_id = 1
        self.tracks: Dict[int, Track] = {}

    def update(self, detections, ts):
        track_ids = list(self.tracks.keys())
        unmatched_dets = set(range(len(detections)))
        matched = {}

        if track_ids and detections:
            iou_mat = np.zeros((len(track_ids), len(detections)), dtype=np.float32)
            for i, tid in enumerate(track_ids):
                for j, det in enumerate(detections):
                    iou_mat[i, j] = iou_xyxy(self.tracks[tid].box, det)
            while True:
                i, j = np.unravel_index(np.argmax(iou_mat), iou_mat.shape)
                best = float(iou_mat[i, j])
                if best < self.iou_thres:
                    break
                tid = track_ids[i]
                if j not in unmatched_dets:
                    iou_mat[i, j] = -1
                    continue
                matched[tid] = j
                unmatched_dets.remove(j)
                iou_mat[i, :] = -1
                iou_mat[:, j] = -1

        for tid, j in matched.items():
            det = detections[j]
            tr = self.tracks[tid]
            prev_c = tr.last_centroid
            new_c = centroid_xyxy(det)
            dt = max(1e-6, ts - tr.last_seen_ts)
            dist = float(np.hypot(new_c[0] - prev_c[0], new_c[1] - prev_c[1]))
            tr.speed_px_per_s = dist / dt
            tr.box = det
            tr.last_centroid = new_c
            tr.last_seen_ts = ts
            tr.movement_history.append((ts, tr.speed_px_per_s))
            if dist < CFG.idle_px_thresh:
                if tr.idle_started_ts is None:
                    tr.idle_started_ts = ts
            else:
                if tr.idle_started_ts is not None:
                    tr.total_idle_secs += (ts - tr.idle_started_ts)
                    tr.idle_started_ts = None

        for j in unmatched_dets:
            det = detections[j]
            c = centroid_xyxy(det)
            tid = self.next_id
            self.next_id += 1
            self.tracks[tid] = Track(
                track_id=tid, box=det, last_seen_ts=ts,
                last_centroid=c, movement_history=[(ts, 0.0)]
            )

        to_del = [tid for tid, tr in self.tracks.items() if (ts - tr.last_seen_ts) > self.max_lost_secs]
        for tid in to_del:
            del self.tracks[tid]
        return self.tracks


# =========================
# Fatigue Logic
# =========================
def compute_repeat_count(tr, ts):
    tr.risk_event_ts = [t for t in tr.risk_event_ts if (ts - t) <= CFG.repeat_window_secs]
    return len(tr.risk_event_ts)

def compute_low_activity_score(tr, ts, window_secs=60.0):
    hist = [(t, s) for (t, s) in tr.movement_history if (ts - t) <= window_secs]
    if len(hist) < 5:
        return 0.0
    speeds = np.array([s for _, s in hist], dtype=np.float32)
    return clamp(1.0 - (float(np.mean(speeds)) / 120.0), 0.0, 1.0)

def fatigue_score(tr, ts):
    reasons = []
    idle_open = (ts - tr.idle_started_ts) if tr.idle_started_ts else 0.0
    idle_now = idle_open >= CFG.idle_secs_trigger
    if idle_now:
        reasons.append("PROLONGED_IDLE")
    rep = compute_repeat_count(tr, ts)
    rep_factor = clamp(rep / float(CFG.repeat_events_N), 0.0, 1.0)
    if rep >= CFG.repeat_events_N:
        reasons.append("REPEAT_RISK_EVENTS")
    low_act = compute_low_activity_score(tr, ts)
    if low_act > 0.75:
        reasons.append("LOW_ACTIVITY_TREND")
    score = (CFG.w_idle * (1.0 if idle_now else 0.0) + CFG.w_repeat * rep_factor + CFG.w_low_activity * low_act) * 100.0
    return int(round(clamp(score, 0.0, 100.0))), reasons

def fatigue_level(score):
    if score <= CFG.fatigue_low: return "Low"
    if score <= CFG.fatigue_med: return "Medium"
    return "High"


# =========================
# Detection
# =========================
model = None
def get_model():
    global model
    if model is None and YOLO:
        model = YOLO(CFG.model_name)
    return model

def detect_people(frame, conf):
    m = get_model()
    if m is None:
        return []
    res = m.predict(frame, conf=conf, verbose=False)[0]
    boxes = []
    if res.boxes is None:
        return boxes
    for b in res.boxes:
        if int(b.cls.item()) != PERSON_CLASS_ID:
            continue
        boxes.append(b.xyxy.cpu().numpy().reshape(-1).astype(np.float32))
    return boxes


# =========================
# Zone assignment
# =========================
ZONES = [
    {"zone_id": "Z1", "label": "Loading Dock A", "x_min": 0, "x_max": 0.33},
    {"zone_id": "Z2", "label": "Assembly Line B", "x_min": 0.33, "x_max": 0.67},
    {"zone_id": "Z3", "label": "Storage Zone C", "x_min": 0.67, "x_max": 1.0},
]

def assign_zone(cx, frame_width):
    norm_x = cx / frame_width
    for z in ZONES:
        if z["x_min"] <= norm_x < z["x_max"]:
            return z["zone_id"], z["label"]
    return "Z1", "Loading Dock A"


# =========================
# FastAPI App
# =========================
app = FastAPI(title="WARESPY Backend")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Shared state
latest_state = {}
alert_history = []
fatigue_history_rows = []
shift_start = time.time()
total_tracks_seen = set()
peak_fatigue = 0
peak_fatigue_time = "--:--:--"

tracker = IoUTracker(iou_thres=CFG.iou_match_thres)


def build_dashboard_state(tracks_dict, ts, frame_width):
    global peak_fatigue, peak_fatigue_time, alert_history, fatigue_history_rows

    zone_data = {z["zone_id"]: {"zone_id": z["zone_id"], "label": z["label"], "tracks": [], "avg_fatigue": 0,
        "fatigue_distribution": {"low": 0, "medium": 0, "high": 0}, "repeat_unsafe_count": 0,
        "risk_trend": "Stable", "active_tracks": 0} for z in ZONES}

    all_tracks_out = []
    for tid, tr in tracks_dict.items():
        total_tracks_seen.add(tid)
        score, reasons = fatigue_score(tr, ts)
        level = fatigue_level(score)
        rep = compute_repeat_count(tr, ts)

        if tr.speed_px_per_s > 160.0:
            tr.risk_event_ts.append(ts)

        if score > peak_fatigue:
            peak_fatigue = score
            peak_fatigue_time = time.strftime("%H:%M:%S")

        cx, cy = tr.last_centroid
        zid, zlabel = assign_zone(cx, frame_width)

        track_out = {
            "track_id": tid,
            "bbox": tr.box.tolist(),
            "conf": 0.85,
            "centroid": [cx, cy],
            "speed": round(tr.speed_px_per_s, 1),
            "posture_event": None,
            "ppe_event": None,
            "fatigue_score": score,
            "fatigue_level": level,
            "repeated_unsafe": rep >= CFG.repeat_events_N,
            "reasons": reasons,
            "idle_total_secs": round(tr.total_idle_secs, 1),
            "repeat_count": rep,
            "movement_intensity": round(tr.speed_px_per_s, 1),
            "low_activity_score": round(compute_low_activity_score(tr, ts), 2),
            "active_seconds": round(ts - shift_start, 0),
        }
        all_tracks_out.append(track_out)
        zone_data[zid]["tracks"].append(track_out)

        if score >= 70 or rep >= CFG.repeat_events_N:
            alert_history.insert(0, {
                "id": f"alert-{len(alert_history)+1}",
                "timestamp": time.strftime("%H:%M:%S"),
                "zone_id": zid,
                "track_id": tid,
                "severity": level,
                "message": f"{level} fatigue on Track #{tid} in {zlabel}",
                "reasons": reasons if reasons else ["—"],
            })
            alert_history = alert_history[:50]

    for zid, zd in zone_data.items():
        tracks = zd["tracks"]
        zd["active_tracks"] = len(tracks)
        if tracks:
            scores = [t["fatigue_score"] for t in tracks]
            zd["avg_fatigue"] = round(sum(scores) / len(scores))
            zd["fatigue_distribution"]["low"] = sum(1 for t in tracks if t["fatigue_level"] == "Low")
            zd["fatigue_distribution"]["medium"] = sum(1 for t in tracks if t["fatigue_level"] == "Medium")
            zd["fatigue_distribution"]["high"] = sum(1 for t in tracks if t["fatigue_level"] == "High")
            zd["repeat_unsafe_count"] = sum(1 for t in tracks if t["repeated_unsafe"])

    zones_list = list(zone_data.values())
    overall_avg = round(sum(z["avg_fatigue"] for z in zones_list) / max(1, len(zones_list)))

    fatigue_history_rows.append({
        "time": time.strftime("%H:%M:%S"),
        "overall": overall_avg,
        "Z1": zone_data["Z1"]["avg_fatigue"],
        "Z2": zone_data["Z2"]["avg_fatigue"],
        "Z3": zone_data["Z3"]["avg_fatigue"],
    })
    fatigue_history_rows = fatigue_history_rows[-120:]

    trend = "Stable"
    if len(fatigue_history_rows) >= 6:
        recent = [r["overall"] for r in fatigue_history_rows[-6:]]
        if recent[-1] - recent[0] > 5: trend = "Up"
        elif recent[0] - recent[-1] > 5: trend = "Down"

    riskiest = max(zones_list, key=lambda z: z["avg_fatigue"])

    return {
        "active_tracks": len(tracks_dict),
        "fatigue_alerts_30m": sum(1 for a in alert_history if a["severity"] == "High"),
        "repeated_unsafe_30m": sum(1 for t in all_tracks_out if t["repeated_unsafe"]),
        "overall_risk_trend": trend,
        "zones": zones_list,
        "alerts": alert_history[:30],
        "fatigue_history": fatigue_history_rows,
        "shift_summary": {
            "total_tracks_seen": len(total_tracks_seen),
            "peak_fatigue": peak_fatigue,
            "peak_fatigue_time": peak_fatigue_time,
            "total_high_alerts": sum(1 for a in alert_history if a["severity"] == "High"),
            "total_repeat_unsafe": sum(1 for t in all_tracks_out if t["repeated_unsafe"]),
            "avg_fatigue_shift": overall_avg,
            "top_risky_zone": riskiest["label"],
            "shift_duration_min": round((time.time() - shift_start) / 60),
        },
        "config": {
            "idle_px_thresh": CFG.idle_px_thresh,
            "idle_secs_trigger": CFG.idle_secs_trigger,
            "repeat_events_N": CFG.repeat_events_N,
            "repeat_window_secs": CFG.repeat_window_secs,
            "fatigue_low": CFG.fatigue_low,
            "fatigue_med": CFG.fatigue_med,
            "process_every_n_frames": CFG.process_every_n_frames,
            "resize_width": CFG.resize_width,
            "max_fps": CFG.max_fps,
        },
    }


# Video processing loop
async def video_loop():
    global latest_state
    cap = cv2.VideoCapture(CFG.video_path)
    if not cap.isOpened():
        print(f"ERROR: Cannot open video: {CFG.video_path}")
        return

    frame_i = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # loop
            continue

        frame_i += 1
        if frame_i % CFG.process_every_n_frames != 0:
            await asyncio.sleep(0.01)
            continue

        ts = time.time()
        frame = resize_keep_aspect(frame, CFG.resize_width)
        boxes = detect_people(frame, CFG.conf_thres)
        tracks = tracker.update(boxes, ts)
        latest_state = build_dashboard_state(tracks, ts, frame.shape[1])

        await asyncio.sleep(max(0.01, 1.0 / CFG.max_fps))


@app.on_event("startup")
async def startup():
    asyncio.create_task(video_loop())


@app.websocket("/ws/live")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            if latest_state:
                await ws.send_json(latest_state)
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        pass


@app.get("/api/state")
async def get_state():
    return latest_state or {"status": "no data yet"}


@app.get("/health")
async def health():
    return {"status": "ok", "tracks": len(tracker.tracks)}


# MJPEG stream for video feed overlay
def gen_mjpeg():
    cap = cv2.VideoCapture(CFG.video_path)
    while True:
        ok, frame = cap.read()
        if not ok:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        frame = resize_keep_aspect(frame, CFG.resize_width)
        
        # Draw boxes from tracker
        ts = time.time()
        for tid, tr in tracker.tracks.items():
            score, reasons = fatigue_score(tr, ts)
            level = fatigue_level(score)
            rep = compute_repeat_count(tr, ts)
            x1, y1, x2, y2 = tr.box.astype(int)
            color = (80, 200, 120) if level == "Low" else (40, 180, 255) if level == "Medium" else (60, 60, 255)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"ID {tid} | FAT {score} {level.upper()} | REP {rep}"
            cv2.putText(frame, label, (x1, max(20, y1 - 10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

        _, jpeg = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
        time.sleep(1.0 / CFG.max_fps)


@app.get("/video_feed")
async def video_feed():
    return StreamingResponse(gen_mjpeg(), media_type="multipart/x-mixed-replace; boundary=frame")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        CFG.video_path = sys.argv[1]
    print(f"Starting WARESPY backend on :8765 with video={CFG.video_path}")
    uvicorn.run(app, host="0.0.0.0", port=8765)
