import { Eye, Linkedin, Twitter, Github } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Dashboard", "Pricing", "Security"],
    Company: ["About", "Careers", "Blog", "Contact"],
    Resources: ["Documentation", "API", "Case Studies", "Support"],
    Legal: ["Privacy Policy", "Terms of Service", "GDPR", "Cookie Policy"],
  };

  return (
    <footer className="border-t border-border/30 bg-muted/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                WARE<span className="text-gradient">SPY</span>
              </span>
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Privacy-first warehouse intelligence. Transform video into operational insights without surveillance.
            </p>
            <div className="flex items-center gap-4">
              {[Linkedin, Twitter, Github].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 WARESPY. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with privacy at the core.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
