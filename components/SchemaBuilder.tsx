import React from 'react';
import { SchemaField, DataType } from '../types';
import { Plus, Trash2, Info } from 'lucide-react';

interface SchemaBuilderProps {
  fields: SchemaField[];
  setFields: React.Dispatch<React.SetStateAction<SchemaField[]>>;
}

export const SchemaBuilder: React.FC<SchemaBuilderProps> = ({ fields, setFields }) => {
  const addField = () => {
    const newField: SchemaField = {
      id: crypto.randomUUID(),
      key: '',
      type: DataType.STRING,
      description: '',
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<SchemaField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-lg font-medium text-primary">Data Schema</h2>
          <p className="text-neutral-500 text-sm mt-1 font-light">
            Define the structure you want to extract.
          </p>
        </div>
        <button
          onClick={addField}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={16} /> Add Field
        </button>
      </div>

      <div className="space-y-3">
        {fields.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
            <p className="text-neutral-400 text-sm">No fields defined. Start by adding one.</p>
          </div>
        )}

        {fields.map((field) => (
          <div
            key={field.id}
            className="group flex flex-col md:flex-row gap-4 p-5 rounded-xl bg-white border border-neutral-200 shadow-sm transition-all hover:border-neutral-300 hover:shadow-md"
          >
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Key</label>
              <input
                type="text"
                value={field.key}
                onChange={(e) => updateField(field.id, { key: e.target.value })}
                placeholder="field_name"
                className="w-full bg-neutral-50 border-0 rounded-lg px-3 py-2.5 text-sm text-primary font-mono focus:ring-1 focus:ring-primary placeholder-neutral-300 transition-all"
              />
            </div>

            <div className="w-full md:w-40 space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Type</label>
              <div className="relative">
                <select
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as DataType })}
                  className="w-full appearance-none bg-neutral-50 border-0 rounded-lg px-3 py-2.5 text-sm text-primary focus:ring-1 focus:ring-primary cursor-pointer transition-all"
                >
                  <option value={DataType.STRING}>String</option>
                  <option value={DataType.NUMBER}>Number</option>
                  <option value={DataType.BOOLEAN}>Boolean</option>
                  <option value={DataType.ARRAY_STRING}>List</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="flex-[2] space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                Context
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={field.description}
                  onChange={(e) => updateField(field.id, { description: e.target.value })}
                  placeholder="Describe what to extract..."
                  className="w-full bg-neutral-50 border-0 rounded-lg px-3 py-2.5 text-sm text-primary focus:ring-1 focus:ring-primary placeholder-neutral-300 transition-all"
                />
                <button
                    onClick={() => removeField(field.id)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 mt-auto"
                    title="Remove field"
                >
                    <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {fields.length > 0 && (
          <div className="mt-8 flex items-start gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
            <Info className="shrink-0 text-neutral-400 mt-0.5" size={16} />
            <p className="text-xs text-neutral-500 leading-relaxed">
              <strong>Tip:</strong> The quality of extraction depends heavily on the description. Be specific about formats (e.g., "YYYY-MM-DD" for dates) to get the best results.
            </p>
          </div>
      )}
    </div>
  );
};