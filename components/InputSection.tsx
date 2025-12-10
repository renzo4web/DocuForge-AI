import React, { useState } from 'react';
import { UploadedFile } from '../types';
import { Upload, FileText, Image as ImageIcon, X } from 'lucide-react';

interface InputSectionProps {
  onInputCheck: (file: UploadedFile | null) => void;
  initialFile: UploadedFile | null;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onInputCheck,
  initialFile,
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const uploadedFile: UploadedFile = {
        name: file.name,
        type: file.type,
        data: result,
        isImage: file.type.startsWith('image/'),
      };
      onInputCheck(uploadedFile);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full animate-slide-up">
      {initialFile ? (
        <div className="group relative bg-white rounded-xl border border-neutral-200 p-6 flex items-start gap-6 shadow-soft transition-all hover:shadow-lg hover:border-neutral-300">
          <button
            onClick={() => onInputCheck(null)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove file"
          >
            <X size={18} />
          </button>
          
          <div className="w-20 h-20 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0 overflow-hidden">
            {initialFile.isImage ? (
              <img src={initialFile.data} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <FileText strokeWidth={1.5} size={32} className="text-neutral-400" />
            )}
          </div>
          
          <div className="flex flex-col justify-center h-20">
            <h3 className="font-medium text-primary text-lg truncate max-w-md">{initialFile.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wide px-2 py-0.5 bg-neutral-50 rounded border border-neutral-100">
                {initialFile.type.split('/')[1] || 'FILE'}
              </span>
              <span className="text-sm text-neutral-400">Ready for extraction</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`relative h-80 rounded-xl border border-dashed transition-all duration-300 flex flex-col items-center justify-center bg-neutral-50/50 ${
            dragActive 
              ? 'border-primary bg-neutral-50 scale-[1.01]' 
              : 'border-neutral-300 hover:border-neutral-400 hover:bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center mb-6">
            <Upload strokeWidth={1.5} size={28} className="text-neutral-600" />
          </div>
          <p className="text-lg font-medium text-primary mb-2">Drop your document here</p>
          <p className="text-neutral-400 text-sm mb-8">Support for Images, PDF, TXT, MD</p>
          
          <label className="cursor-pointer group">
            <span className="px-6 py-3 rounded-lg bg-white border border-neutral-200 text-sm font-medium text-neutral-600 shadow-sm transition-all group-hover:border-neutral-300 group-hover:text-primary">
              Browse Files
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf,.txt,.md,.csv"
            />
          </label>
        </div>
      )}
    </div>
  );
};