import { Building2, Lock, Hash, Bitcoin } from "lucide-react";
import { type ReactNode } from "react";

interface AccountTypeCardProps {
  icon: ReactNode;
  title: string;
  fee: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

const iconMap: Record<string, ReactNode> = {
  savings: <Building2 className="w-6 h-6 text-primary" />,
  custody: <Lock className="w-6 h-6 text-gold" />,
  numbered: <Hash className="w-6 h-6 text-primary" />,
  crypto: <Bitcoin className="w-6 h-6 text-foreground" />,
};

export const getAccountIcon = (type: string) => iconMap[type] || <Building2 className="w-6 h-6" />;

const AccountTypeCard = ({ icon, title, fee, description, selected, onSelect }: AccountTypeCardProps) => {
  return (
    <div
      onClick={onSelect}
      className={`account-type-card ${selected ? "account-type-card-selected" : ""}`}
    >
      <div className="absolute top-4 right-4">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-primary" : "border-muted-foreground"
          }`}
        >
          {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
      </div>
      <div className="mb-3">{icon}</div>
      <h4 className="font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-sm font-medium text-primary mb-2">{fee}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default AccountTypeCard;
