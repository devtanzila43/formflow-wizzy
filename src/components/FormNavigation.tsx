import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSave?: () => void;
  isSubmitting?: boolean;
}

const FormNavigation = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSave,
  isSubmitting,
}: FormNavigationProps) => {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between pt-8 border-t border-border mt-8">
      <div className="flex items-center gap-3">
        {currentStep > 1 && (
          <button onClick={onBack} className="btn-outline flex items-center gap-2" type="button">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
        )}
        {onSave && (
          <button onClick={onSave} className="btn-outline flex items-center gap-2" type="button">
            <Save className="w-4 h-4" />
            SAVE & CONTINUE LATER
          </button>
        )}
      </div>
      <button
        onClick={onNext}
        disabled={isSubmitting}
        className="btn-primary flex items-center gap-2"
        type="button"
      >
        {isLastStep ? "SUBMIT APPLICATION" : "NEXT STEP"}
        {!isLastStep && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default FormNavigation;
