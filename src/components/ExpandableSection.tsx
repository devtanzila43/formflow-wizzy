import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableSectionProps {
  title: string;
  children: ReactNode;
}

const ExpandableSection = ({ title, children }: ExpandableSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card-glass">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-sm font-semibold text-primary uppercase tracking-wider"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && (
        <div className="mt-4 text-xs text-muted-foreground leading-relaxed space-y-3 max-h-[400px] overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
