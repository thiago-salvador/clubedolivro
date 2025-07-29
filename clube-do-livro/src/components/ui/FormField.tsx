import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  success?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helpText?: string;
  autoComplete?: string;
  icon?: React.ReactNode;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  success,
  required = false,
  disabled = false,
  placeholder,
  helpText,
  autoComplete,
  icon,
  onBlur,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasValue = value && value.length > 0;
  
  const inputClasses = `
    w-full px-4 py-3 pr-10 
    border rounded-lg 
    transition-all duration-200
    ${icon ? 'pl-10' : 'pl-4'}
    ${error 
      ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
      : success 
        ? 'border-green-500 focus:ring-2 focus:ring-green-200 focus:border-green-500'
        : 'border-gray-300 focus:ring-2 focus:ring-terracota/20 focus:border-terracota'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  return (
    <div className="relative">
      <label 
        htmlFor={name} 
        className={`
          block text-sm font-medium mb-2 transition-colors duration-200
          ${error ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700'}
          ${isFocused ? 'text-terracota' : ''}
        `}
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="campo obrigatório">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className={`${error ? 'text-red-500' : success ? 'text-green-500' : 'text-gray-400'}`}>
              {icon}
            </span>
          </div>
        )}
        
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          className={inputClasses}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : helpText ? `${name}-help` : undefined
          }
        />
        
        {/* Status Icons */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {type === 'password' && hasValue && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          
          {error && type !== 'password' && (
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          )}
          
          {success && !error && type !== 'password' && (
            <CheckCircle className="h-5 w-5 text-green-500" aria-hidden="true" />
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <p 
          className="mt-2 text-sm text-red-600 flex items-center gap-1" 
          id={`${name}-error`}
          role="alert"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      
      {/* Help Text */}
      {helpText && !error && (
        <p 
          className="mt-2 text-sm text-gray-500" 
          id={`${name}-help`}
        >
          {helpText}
        </p>
      )}
      
      {/* Success Message */}
      {success && !error && (
        <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
          <CheckCircle className="h-4 w-4" />
          Campo válido
        </p>
      )}
    </div>
  );
};

export default FormField;