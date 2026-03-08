const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto py-10 px-4 text-center space-y-3">
        <h3 className="text-primary font-bold text-lg tracking-widest">PROMINENCE BANK</h3>
        <p className="text-xs text-muted-foreground">
          ETMO Licensed Entity · License No. 05052025-A · +44 20 8895 6493
        </p>
        <p className="text-xs text-muted-foreground">
          helpdesk@prominencebank.com · ETMO (Extraterritorial Trade Mission Office)
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} PROMINENCE BANK · ALL RIGHTS RESERVED · PRIVACY POLICY
        </p>
      </div>
    </footer>
  );
};

export default Footer;
