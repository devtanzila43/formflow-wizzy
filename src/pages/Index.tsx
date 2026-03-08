import { Link } from "react-router-dom";
import { Building2, User, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-primary mb-3 flex items-center justify-center gap-2">
            <span className="w-8 h-0.5 bg-primary" />
            Prominence Bank
            <span className="w-8 h-0.5 bg-primary" />
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Bank Account <span className="text-primary font-display italic">Application</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Open a new bank account with Prominence Bank. Select the application type below to begin your multi-step application process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/personal-bank-account" className="group">
            <div className="card-glass hover:border-primary/50 transition-all h-full flex flex-col">
              <div className="mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Personal Account</h2>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                Open a personal banking account. Available types: Savings, Custody, Numbered, and Cryptocurrency accounts.
              </p>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                Start Application <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          <Link to="/business-bank-account" className="group">
            <div className="card-glass hover:border-primary/50 transition-all h-full flex flex-col">
              <div className="mb-4">
                <Building2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Business Account</h2>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                Open a corporate banking account. Complete company, director, signatory, and beneficiary information.
              </p>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                Start Application <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
