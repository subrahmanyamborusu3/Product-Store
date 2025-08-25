import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'textarea' | 'number' | 'url' | 'select' | 'checkbox';
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  options = [],
  rows = 3
}) => {
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors
    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            rows={rows}
            className={baseInputClasses}
          />
        );

      case 'select':
        return (
          <select
            id={id}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={baseInputClasses}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={id}
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => onChange(e.target.checked)}
              onBlur={onBlur}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor={id} className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        );

      default:
        return (
          <input
            id={id}
            type={type}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            className={baseInputClasses}
            step={type === 'number' ? '0.01' : undefined}
            min={type === 'number' ? '0' : undefined}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderInput()}
        {error && (
          <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {renderInput()}
      {error && (
        <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormField;