import { Phone, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <div className="bg-background border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-2 px-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> +44 20 8895 6493
            </span>
            <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-semibold text-[10px]">
              KTT
            </span>
            <span>(051) 210567 PROMIN G</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Diplomatic Jurisdiction – Foreign Trade Mission Office (ETMO)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-secondary text-foreground text-[10px] font-medium">FAQ</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="border border-primary/50 rounded-lg px-3 py-2">
              <span className="text-primary font-bold text-lg tracking-wide">PROMINENCE</span>
              <div className="text-[10px] text-muted-foreground text-center tracking-widest">— BANK —</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link
              to="/personal-bank-account"
              className={`hover:text-primary transition-colors ${location.pathname === "/personal-bank-account" ? "text-primary" : ""}`}
            >
              Personal Account
            </Link>
            <Link
              to="/business-bank-account"
              className={`hover:text-primary transition-colors ${location.pathname === "/business-bank-account" ? "text-primary" : ""}`}
            >
              Business Account
            </Link>
            <a href="https://prominencebank.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              Main Site
            </a>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
