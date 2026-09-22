const FormInput = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  success = false,
  disabled = false,
  readOnly = false,
  required = false,
  min,
  max,
  className = '',
}) => {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#12223a] mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        min={min}
        max={max}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`
          w-full px-4 py-3 text-sm rounded-xl border
          text-[#12223a] placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-gray-300
          transition-colors duration-150
          ${readOnly || disabled ? 'bg-gray-50 cursor-not-allowed text-gray-500' : 'bg-white'}
          ${error ? 'border-red-400 bg-red-50' : success ? 'border-emerald-400' : 'border-gray-200'}
        `}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-500 animate-slideDown">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
