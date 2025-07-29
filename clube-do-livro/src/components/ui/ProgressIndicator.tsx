import React from 'react';
import { CheckIcon } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressIndicatorProps {
  steps: Step[];
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  variant = 'linear',
  size = 'md',
  showLabels = true,
  className = ''
}) => {
  const currentStepIndex = steps.findIndex(step => step.status === 'current');
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  if (variant === 'circular') {
    const radius = size === 'sm' ? 40 : size === 'md' ? 60 : 80;
    const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          className="transform -rotate-90"
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
        >
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-terracota transition-all duration-500 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{Math.round(progressPercentage)}%</p>
            {showLabels && (
              <p className="text-sm text-gray-600">
                {currentStepIndex + 1} de {steps.length}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Linear variant
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={className}>
      {/* Progress bar */}
      <div className="relative">
        <div className={`bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
          <div
            className="bg-terracota h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso: ${Math.round(progressPercentage)}%`}
          />
        </div>
        
        {/* Step indicators */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-1">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`
                w-6 h-6 rounded-full border-2 bg-white
                flex items-center justify-center
                transition-all duration-300
                ${step.status === 'completed' 
                  ? 'border-terracota bg-terracota' 
                  : step.status === 'current'
                  ? 'border-terracota'
                  : 'border-gray-300'
                }
              `}
            >
              {step.status === 'completed' && (
                <CheckIcon className="w-3 h-3 text-white" />
              )}
              {step.status === 'current' && (
                <div className="w-2 h-2 bg-terracota rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Labels */}
      {showLabels && (
        <div className="mt-4 flex justify-between">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`text-center flex-1 ${index > 0 ? 'ml-2' : ''}`}
            >
              <p className={`
                text-sm font-medium
                ${step.status === 'completed' || step.status === 'current'
                  ? 'text-gray-900'
                  : 'text-gray-500'
                }
              `}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500 mt-1">
                  {step.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;