import React from "react";
import { Plus, Edit2, Trash2, Check, Save } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Select } from "../../../../components/ui/Select";
import type { EventType } from "../../EventEdit";

interface BookingFormTabProps {
  bookingFields: EventType["bookingFields"];
  onFieldStatusChange: (fieldId: string, status: "Hidden" | "Optional" | "Required") => void;
  editingFieldId: string | null;
  editingLabel: string;
  setEditingFieldId: (id: string | null) => void;
  setEditingLabel: (label: string) => void;
  onSaveFieldLabel: (fieldId: string) => void;
  onDeleteField: (fieldId: string) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  newFieldLabel: string;
  setNewFieldLabel: (label: string) => void;
  newFieldType: string;
  setNewFieldType: (type: string) => void;
  newFieldStatus: "Required" | "Optional" | "Hidden";
  setNewFieldStatus: (status: "Required" | "Optional" | "Hidden") => void;
  onAddField: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export function BookingFormTab({
  bookingFields,
  onFieldStatusChange,
  editingFieldId,
  editingLabel,
  setEditingFieldId,
  setEditingLabel,
  onSaveFieldLabel,
  onDeleteField,
  showAddForm,
  setShowAddForm,
  newFieldLabel,
  setNewFieldLabel,
  newFieldType,
  setNewFieldType,
  newFieldStatus,
  setNewFieldStatus,
  onAddField,
  onSave,
  isSaving,
}: BookingFormTabProps) {
  return (
    <div className="bg-white border border-[#E4E1D4] rounded-2xl p-8 shadow-[3px_3px_0_rgba(23,22,20,0.08)] space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-cal-sans text-xl font-bold uppercase tracking-wider text-[#171614]">Booking Questions</h3>
          <p className="text-xs text-[#2B2A27]/60 font-semibold mt-1">Configure and edit custom questions shown to your invitees.</p>
        </div>
        {!showAddForm && (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="secondary"
            size="sm"
            rounded="xl"
            shadow="sm"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[3]" />
            Add Question
          </Button>
        )}
      </div>

      {/* Add Custom Question Inline Form */}
      {showAddForm && (
        <div className="p-5 border border-[#E4E1D4] rounded-2xl bg-[#F3E75B]/5 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex justify-between items-center pb-2 border-b border-[#E4E1D4]">
            <h4 className="text-xs font-extrabold uppercase text-[#171614] tracking-wider">New Booking Question</h4>
            <button onClick={() => setShowAddForm(false)} className="text-xs font-bold text-[#2B2A27] hover:underline">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171614]">Question Label</label>
              <input
                type="text"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
                placeholder="e.g. What is your company size?"
                className="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl text-sm bg-white font-semibold text-[#171614] focus:outline-none focus:border-[#B7ACF7] transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171614]">Input Type</label>
              <Select
                value={newFieldType}
                onChange={(val) => setNewFieldType(val)}
                options={[
                  { value: "Short Text", label: "Short Text" },
                  { value: "Long Text", label: "Long Text" },
                  { value: "Phone", label: "Phone" },
                  { value: "Multiple Emails", label: "Multiple Emails" },
                ]}
                buttonClassName="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl text-sm bg-white font-semibold text-[#171614] text-left flex justify-between items-center hover:bg-[#FDFBF2] transition-all cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#171614]">Status</label>
              <Select
                value={newFieldStatus}
                onChange={(val) => setNewFieldStatus(val as any)}
                options={[
                  { value: "Required", label: "Required" },
                  { value: "Optional", label: "Optional" },
                  { value: "Hidden", label: "Hidden" },
                ]}
                buttonClassName="w-full px-4 py-2.5 border border-[#E4E1D4] rounded-xl text-sm bg-white font-semibold text-[#171614] text-left flex justify-between items-center hover:bg-[#FDFBF2] transition-all cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={onAddField} variant="primary" size="sm" rounded="xl" disabled={!newFieldLabel.trim()}>
              Add to Form
            </Button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3.5">
        {bookingFields.map((field) => (
          <div key={field.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-[#E4E1D4] rounded-xl bg-[#FDFBF2]/20 hover:bg-[#FDFBF2]/40 transition-all gap-4">
            
            {/* Left details (with edit mode support) */}
            <div className="flex-1">
              {editingFieldId === field.id ? (
                <div className="flex items-center gap-2 max-w-md">
                  <input
                    type="text"
                    value={editingLabel}
                    onChange={(e) => setEditingLabel(e.target.value)}
                    className="flex-1 px-4 py-2 border border-[#E4E1D4] rounded-xl text-sm bg-white font-semibold text-[#171614] focus:outline-none focus:border-[#B7ACF7] transition-all"
                  />
                  <button
                    onClick={() => onSaveFieldLabel(field.id)}
                    className="p-1.5 bg-[#7CEFC0]/20 hover:bg-[#7CEFC0] border border-[#171614]/15 rounded-lg text-[#171614] transition-all"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-[#171614]">{field.label}</h4>
                  <span className="text-[9px] bg-[#B7ACF7]/20 border border-[#B7ACF7]/40 px-1.5 py-0.5 rounded font-extrabold text-[#171614]/85 uppercase tracking-wide">
                    {field.type}
                  </span>
                </div>
              )}
            </div>

            {/* Right actions (Status & Edit options) */}
            <div className="flex items-center gap-3 shrink-0">
              {field.editable ? (
                <>
                  <Select
                    value={field.status}
                    onChange={(val) => onFieldStatusChange(field.id, val as any)}
                    options={[
                      { value: "Required", label: "Required" },
                      { value: "Optional", label: "Optional" },
                      { value: "Hidden", label: "Hidden" },
                    ]}
                    size="sm"
                    className="w-28"
                  />

                  {editingFieldId !== field.id && (
                    <button
                      onClick={() => {
                        setEditingFieldId(field.id);
                        setEditingLabel(field.label);
                      }}
                      className="p-1.5 border border-[#E4E1D4] rounded-lg hover:border-[#171614] hover:bg-white text-[#2B2A27] transition-all cursor-pointer"
                      title="Edit Label"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteField(field.id)}
                    className="p-1.5 border border-transparent hover:border-[#E5484D]/35 hover:bg-[#E5484D]/10 rounded-lg text-[#E5484D] transition-all cursor-pointer"
                    title="Delete Field"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <span className="text-[10px] font-bold text-[#23C585] bg-[#23C585]/10 border border-[#23C585]/20 px-3 py-1.5 rounded-lg select-none">
                  Required (System)
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="pt-6 border-t border-[#E4E1D4] flex justify-end">
          <Button onClick={onSave} variant="primary" size="sm" rounded="xl" shadow="sm" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            Save Questions
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BookingFormTab;
