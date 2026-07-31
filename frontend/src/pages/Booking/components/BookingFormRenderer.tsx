import React from "react";

export interface BookingFieldConfig {
  id: string;
  name: string;
  type: string; // "text" | "email" | "phone" | "textarea" | "select" | "checkbox"
  required: boolean;
  options?: string[];
}

interface BookingFormRendererProps {
  fields: BookingFieldConfig[];
  formData: Record<string, any>;
  onFieldChange: (fieldId: string, value: any) => void;
  errors: Record<string, string>;
}

export const BookingFormRenderer: React.FC<BookingFormRendererProps> = ({
  fields,
  formData,
  onFieldChange,
  errors,
}) => {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const error = errors[field.id];
        const val = formData[field.id] ?? "";

        return (
          <div key={field.id} className="space-y-1">
            <label className="text-xs font-bold text-[#171614] flex items-center justify-between">
              <span>
                {field.name}
                {field.required && <span className="text-[#E5484D] ml-1">*</span>}
              </span>
            </label>

            {field.type === "textarea" ? (
              <textarea
                value={val}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                rows={3}
                className="w-full bg-[#FAF9F5] border border-[#E4E1D4] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#171614] focus:outline-none focus:border-[#171614] focus:ring-1 focus:ring-[#171614] shadow-[2px_2px_0_rgba(23,22,20,0.06)]"
                placeholder={`Enter your ${field.name.toLowerCase()}...`}
              />
            ) : field.type === "select" && field.options ? (
              <select
                value={val}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E4E1D4] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#171614] focus:outline-none focus:border-[#171614] focus:ring-1 focus:ring-[#171614] shadow-[2px_2px_0_rgba(23,22,20,0.06)] cursor-pointer"
              >
                <option value="">-- Select an option --</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                value={val}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                className="w-full bg-[#FAF9F5] border border-[#E4E1D4] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#171614] focus:outline-none focus:border-[#171614] focus:ring-1 focus:ring-[#171614] shadow-[2px_2px_0_rgba(23,22,20,0.06)]"
                placeholder={`Enter ${field.name.toLowerCase()}`}
              />
            )}

            {error && <p className="text-[11px] font-bold text-[#E5484D] mt-0.5">{error}</p>}
          </div>
        );
      })}
    </div>
  );
};
