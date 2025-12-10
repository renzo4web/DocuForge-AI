import React, { useState } from 'react';
import { StepIndicator } from './components/StepIndicator';
import { InputSection } from './components/InputSection';
import { SchemaBuilder } from './components/SchemaBuilder';
import { ResultView } from './components/ResultView';
import { UploadedFile, SchemaField, ExtractionStatus, DataType } from './types';
import { extractDataWithGemini } from './services/geminiService';
import { Loader2, AlertCircle, ArrowRight, ArrowLeft, Sparkles, Book, X } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  
  const [schemaFields, setSchemaFields] = useState<SchemaField[]>([
    { id: '1', key: 'title', type: DataType.STRING, description: 'The main title of the document' },
    { id: '2', key: 'summary', type: DataType.STRING, description: 'A brief summary of the content' },
  ]);

  const [status, setStatus] = useState<ExtractionStatus>('idle');
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputCheck = (uploadedFile: UploadedFile | null) => {
    setFile(uploadedFile);
  };

  const canProceedFromInput = () => {
    return file !== null;
  };

  const canProceedFromSchema = () => {
    return schemaFields.length > 0 && schemaFields.every(f => f.key.trim() !== '');
  };

  const handleProcess = async () => {
    setStatus('processing');
    setErrorMsg(null);
    try {
      const data = await extractDataWithGemini(file, schemaFields);
      setResult(data);
      setStatus('success');
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during extraction.");
      setStatus('error');
    }
  };

  const resetApp = () => {
    setStep(1);
    setFile(null);
    setStatus('idle');
    setResult(null);
    setErrorMsg(null);
  };

  const SocialLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center w-10 h-10 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
      aria-label={label}
    >
      {icon}
    </a>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-primary selection:bg-primary selection:text-white">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 select-none">
            <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">D</span>
                </div>
                <span className="text-lg font-semibold tracking-tight">DocuForge AI</span>
            </div>
            
            {/* Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 border border-neutral-200">
                <Sparkles size={10} className="text-neutral-500" />
                <span className="text-[10px] font-medium text-neutral-600 tracking-wide uppercase">Gemini 3.0 Pro</span>
            </div>
          </div>
          <button 
            onClick={() => setIsDocsOpen(true)}
            className="text-xs font-medium text-neutral-400 hover:text-primary transition-colors flex items-center gap-2"
          >
            <Book size={14} /> Documentation
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto">
          
          <StepIndicator currentStep={step} />

          <div className="mt-12">
            {step === 1 && (
              <div className="animate-fade-in">
                 <div className="mb-10 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-primary mb-3">Upload Source Material</h1>
                    <p className="text-neutral-500 font-light">Transform unstructured documents into clean data.</p>
                 </div>
                 
                <InputSection 
                    onInputCheck={handleInputCheck} 
                    initialFile={file} 
                />
                
                <div className="mt-10 flex justify-end">
                  <button
                    disabled={!canProceedFromInput()}
                    onClick={() => setStep(2)}
                    className={`group flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                      canProceedFromInput()
                        ? 'bg-primary text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    Continue <ArrowRight size={16} className={`transition-transform duration-300 ${canProceedFromInput() ? 'group-hover:translate-x-1' : ''}`} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                 <div className="mb-10 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-primary mb-3">Define Structure</h1>
                    <p className="text-neutral-500 font-light">Tell the AI exactly what you need extracted.</p>
                 </div>
                 
                <SchemaBuilder fields={schemaFields} setFields={setSchemaFields} />
                
                {status === 'error' && (
                    <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex gap-3 items-center text-sm animate-shake">
                        <AlertCircle className="shrink-0" size={18} />
                        <span>{errorMsg}</span>
                    </div>
                )}

                <div className="mt-10 flex justify-between items-center">
                   <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-neutral-400 hover:text-primary transition-colors"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>

                  <button
                    disabled={!canProceedFromSchema() || status === 'processing'}
                    onClick={handleProcess}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 min-w-[160px] justify-center ${
                      canProceedFromSchema() && status !== 'processing'
                        ? 'bg-primary text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    {status === 'processing' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Processing
                      </>
                    ) : (
                      <>Generate <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-primary mb-3">Extraction Results</h1>
                    <p className="text-neutral-500 font-light">Your data is ready for export.</p>
                 </div>
                <ResultView 
                    data={result} 
                    onReset={resetApp} 
                    onBack={() => setStep(2)}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-100 bg-neutral-50/50">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
                <SocialLink 
                    href="https://www.kaggle.com/renzobarrios" 
                    label="Kaggle"
                    icon={
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.825 23.859c-.022.092-.117.141-.283.141h-3.139c-.188 0-.352-.082-.492-.248l-5.16-6.148-1.564 1.51v4.639c0 .193-.156.348-.35.348H4.731a.348.348 0 0 1-.347-.348V.348C4.384.155 4.54 0 4.733 0h3.106c.193 0 .35.155.35.348v15.174l6.197-7.792c.133-.166.293-.248.481-.248h3.333c.18 0 .275.053.286.159a.23.23 0 0 1-.06.192l-5.757 6.476 6.136 9.173a.32.32 0 0 1 .02.377" />
                        </svg>
                    } 
                />
                <SocialLink 
                    href="https://x.com/turbopila" 
                    label="X / Twitter"
                    icon={
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    } 
                />
                <SocialLink 
                    href="https://github.com/renzo4web" 
                    label="GitHub"
                    icon={
                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                    } 
                />
            </div>
            <p className="text-xs text-neutral-400 font-medium tracking-wide">
                Designed & Built by <span className="text-primary font-semibold">Renzo Barrios</span>
            </p>
        </div>
      </footer>

      {/* Documentation Dialog */}
      {isDocsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-neutral-900/20 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsDocsOpen(false)} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-100 p-8 overflow-hidden animate-slide-up">
                <button 
                    onClick={() => setIsDocsOpen(false)}
                    className="absolute top-6 right-6 text-neutral-400 hover:text-primary transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="mb-6">
                    <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center mb-4 border border-neutral-100">
                        <Book size={24} className="text-primary" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-semibold text-primary">Documentation</h2>
                </div>
                
                <div className="space-y-4 text-sm text-neutral-600 leading-relaxed font-light">
                    <p>
                        <strong>DocuForge AI</strong> transforms unstructured files into structured data using the latest multimodal capabilities of <strong>Gemini 3.0 Pro</strong>.
                    </p>
                    <ul className="space-y-2.5 my-4 pl-1">
                        <li className="flex gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                             <span>Upload handwritten notes, PDF documents, or images.</span>
                        </li>
                        <li className="flex gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                             <span>Define a custom data schema for exactly what you need.</span>
                        </li>
                        <li className="flex gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                             <span>The AI intelligently extracts and formats the data.</span>
                        </li>
                    </ul>
                    <p>
                        You can export your results directly to <strong>JSON</strong>, <strong>CSV</strong>, or <strong>TXT</strong>.
                    </p>
                    <p className="text-xs text-neutral-400 mt-6 pt-4 border-t border-neutral-100">
                        Processing is securely handled client-side via the Gemini API. No files are stored on our servers.
                    </p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}