import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  const progress = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {steps.length} — {steps[currentStep - 1]?.label}
        </span>
        <span className="text-sm font-semibold text-primary">{progress}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Step circles */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2 min-w-[80px]">
              <div
                className={`step-circle ${
                  isActive
                    ? "step-circle-active"
                    : isCompleted
                    ? "step-circle-completed"
                    : "step-circle-inactive"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>
              <span
                className={`text-xs text-center leading-tight ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
