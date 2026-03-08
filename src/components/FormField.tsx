import { type ChangeEvent, type ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  name: string;
  error?: string;
  children?: ReactNode;
  textarea?: boolean;
  accept?: string;
  onFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  fileName?: string;
}

const FormField = ({
  label,
  required,
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  error,
  textarea,
  accept,
  onFileChange,
  fileName,
}: FormFieldProps) => {
  if (type === "file") {
    return (
      <div className="space-y-2">
        <label className={`form-label ${required ? "form-label-required" : ""}`}>{label}</label>
        <div className="flex items-center gap-3">
          <label className="btn-outline cursor-pointer text-sm">
            Choose File
            <input
              type="file"
              name={name}
              accept={accept}
              onChange={onFileChange}
              className="hidden"
            />
          </label>
          <span className="text-sm text-muted-foreground">
            {fileName || "No file chosen"}
          </span>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className={`form-label ${required ? "form-label-required" : ""}`}>{label}</label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input min-h-[100px] resize-y"
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-input"
          required={required}
        />
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;
