import React from 'react';
import { Download, Copy, Check, RotateCcw, ArrowLeft, FileJson, FileText, Grid } from 'lucide-react';

interface ResultViewProps {
  data: any;
  onReset: () => void;
  onBack: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ data, onReset, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'json' | 'csv' | 'txt') => {
    let content = '';
    let type = '';
    let ext = '';

    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      type = 'application/json';
      ext = 'json';
    } else if (format === 'csv') {
      const keys = Object.keys(data);
      const values = Object.values(data).map(v => {
         if (Array.isArray(v)) return `"${v.join('; ')}"`;
         if (typeof v === 'object') return `"${JSON.stringify(v).replace(/"/g, '""')}"`;
         return `"${String(v).replace(/"/g, '""')}"`;
      });
      content = `${keys.join(',')}\n${values.join(',')}`;
      type = 'text/csv';
      ext = 'csv';
    } else if (format === 'txt') {
        content = Object.entries(data).map(([k, v]) => {
            const val = Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v);
            return `${k}: ${val}`;
        }).join('\n');
        type = 'text/plain';
        ext = 'txt';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracted_data.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full animate-slide-up">
        <div className="bg-white rounded-xl shadow-soft border border-neutral-200 overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-neutral-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                        <Check size={16} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-primary">Extraction Successful</h3>
                        <p className="text-xs text-neutral-400">Ready to export</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mr-1 hidden sm:block">Download:</span>
                    
                    <button
                        onClick={() => handleDownload('json')}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 hover:text-primary transition-all shadow-sm hover:shadow active:scale-95"
                    >
                        <FileJson size={14} className="text-neutral-400" />
                        JSON
                    </button>
                    
                    <button
                        onClick={() => handleDownload('csv')}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 hover:text-primary transition-all shadow-sm hover:shadow active:scale-95"
                    >
                        <Grid size={14} className="text-neutral-400" />
                        CSV
                    </button>
                    
                    <button
                        onClick={() => handleDownload('txt')}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 hover:text-primary transition-all shadow-sm hover:shadow active:scale-95"
                    >
                        <FileText size={14} className="text-neutral-400" />
                        TXT
                    </button>

                    <div className="w-px h-4 bg-neutral-200 mx-1 hidden sm:block"></div>
                    
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium border rounded-lg transition-all active:scale-95 ${
                            copied 
                                ? 'bg-green-50 border-green-200 text-green-700' 
                                : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-primary'
                        }`}
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Code Viewer */}
            <div className="relative bg-neutral-50/30">
                <pre className="custom-scrollbar w-full h-[500px] overflow-auto p-8 text-sm text-primary font-mono leading-relaxed select-text">
                <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-between items-center">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-neutral-400 hover:text-primary text-sm font-medium transition-colors px-2 py-1"
            >
                <ArrowLeft size={16} /> Edit Schema
            </button>
            <button
                onClick={onReset}
                className="flex items-center gap-2 text-neutral-500 hover:text-primary text-sm font-medium px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-all shadow-sm"
            >
                <RotateCcw size={16} /> Start New
            </button>
        </div>
    </div>
  );
};