import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Play, Pause, Monitor, ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DemoPage = () => {
  const navigate = useNavigate();
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const useSampleVideo = () => {
    // Using a sample surveillance-style video
    setVideoSrc("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4");
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-7 h-7 text-primary" />
            <span className="text-xl font-bold">WARESPY</span>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Experience <span className="text-gradient">WARESPY</span> Intelligence
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload your surveillance footage or use our sample to see real-time analysis
            </p>
          </motion.div>

          {/* Video Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {!videoSrc ? (
              /* Upload Area */
              <div 
                className="aspect-video rounded-2xl border-2 border-dashed border-primary/30 bg-card/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary/60 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-16 h-16 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Upload Surveillance Video</h3>
                <p className="text-muted-foreground mb-6">Click to browse or drag and drop</p>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">or</span>
                  <Button 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      useSampleVideo();
                    }}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Use Sample Video
                  </Button>
                </div>
              </div>
            ) : (
              /* Video Player */
              <div className="relative rounded-2xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full aspect-video object-cover"
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Video Overlay - AI Detection Simulation */}
                {isPlaying && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Simulated detection boxes */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute top-[30%] left-[20%] w-16 h-32 border-2 border-green-500 rounded"
                    >
                      <span className="absolute -top-5 left-0 text-xs bg-green-500 text-black px-1 rounded">
                        Worker #1
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute top-[35%] right-[25%] w-14 h-28 border-2 border-green-500 rounded"
                    >
                      <span className="absolute -top-5 left-0 text-xs bg-green-500 text-black px-1 rounded">
                        Worker #2
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute top-[40%] left-[50%] w-12 h-24 border-2 border-yellow-500 rounded"
                    >
                      <span className="absolute -top-5 left-0 text-xs bg-yellow-500 text-black px-1 rounded">
                        No PPE
                      </span>
                    </motion.div>
                    
                    {/* Zone overlay */}
                    <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-white">Live Analysis Active</span>
                      </div>
                    </div>
                    
                    {/* Detection stats */}
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur px-4 py-3 rounded-lg space-y-1">
                      <div className="text-xs text-muted-foreground">Detected</div>
                      <div className="text-2xl font-bold text-white">3 Workers</div>
                      <div className="text-xs text-yellow-500">1 PPE Violation</div>
                    </div>
                  </div>
                )}
                
                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                    
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setVideoSrc(null);
                          setIsPlaying(false);
                        }}
                        className="text-white hover:bg-white/20"
                      >
                        Change Video
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Analysis Button */}
          {videoSrc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-center"
            >
              {!isAnalyzing ? (
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={startAnalysis}
                  className="group"
                >
                  Start Full Analysis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Analyzing footage...</span>
                    <span className="text-sm text-primary">{analysisProgress}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-primary/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    {analysisProgress < 30 && "Detecting humans and tracking movement..."}
                    {analysisProgress >= 30 && analysisProgress < 60 && "Mapping zones and classifying activities..."}
                    {analysisProgress >= 60 && analysisProgress < 90 && "Generating heatmaps and risk scores..."}
                    {analysisProgress >= 90 && "Preparing dashboard..."}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Human Detection", value: "Real-time" },
              { label: "Zone Mapping", value: "5 Zones" },
              { label: "PPE Monitoring", value: "Active" },
              { label: "Risk Scoring", value: "Live" },
            ].map((item, i) => (
              <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-primary">{item.value}</div>
                <div className="text-sm text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
