import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Upload Source' },
  { id: 2, name: 'Define Schema' },
  { id: 3, name: 'Extraction Results' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress" className="w-full mb-10 animate-fade-in">
      <ol
        role="list"
        className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white md:flex md:divide-y-0 shadow-soft overflow-hidden"
      >
        {steps.map((step, stepIdx) => {
           // Determine status based on currentStep logic
           const status = currentStep > step.id ? 'complete' : currentStep === step.id ? 'current' : 'upcoming';
           
           return (
            <li key={step.name} className="relative md:flex md:flex-1">
              <div className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  {status === 'complete' ? (
                    <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-full bg-primary transition-colors">
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </span>
                  ) : status === 'current' ? (
                    <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-primary bg-white">
                      <span className="text-primary font-mono text-xs font-bold">{`0${step.id}`}</span>
                    </span>
                  ) : (
                    <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50">
                      <span className="text-neutral-400 font-mono text-xs">
                        {`0${step.id}`}
                      </span>
                    </span>
                  )}
                  
                  <span className={`ml-4 text-sm font-medium tracking-tight transition-colors ${
                      status === 'complete' ? 'text-primary' :
                      status === 'current' ? 'text-primary' :
                      'text-neutral-400'
                  }`}>
                    {step.name}
                  </span>
                </span>
              </div>

              {stepIdx !== steps.length - 1 ? (
                <div aria-hidden="true" className="absolute top-0 right-0 hidden h-full w-5 md:block">
                  <svg
                    fill="none"
                    viewBox="0 0 22 80"
                    preserveAspectRatio="none"
                    className="h-full w-full text-neutral-200"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      stroke="currentColor"
                      vectorEffect="non-scaling-stroke"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};