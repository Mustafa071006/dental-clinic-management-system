const FormSelect = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  error = '',
  disabled = false,
  required = false,
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
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`
          w-full px-4 py-3 text-sm rounded-xl border
          text-[#12223a]
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-gray-300
          transition-colors duration-150 appearance-none bg-white
          ${disabled ? 'cursor-not-allowed bg-gray-50 text-gray-500' : ''}
          ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'}
          ${!value ? 'text-gray-400' : 'text-[#12223a]'}
        `}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-500 animate-slideDown">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
