import { Filter } from 'lucide-react';

const FilterDropdown = ({
  value,
  onChange,
  options = [],
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none
          pl-4 pr-9 py-2.5
          text-sm font-medium text-[#12223a]
          border border-gray-200 rounded-xl
          bg-white
          focus:outline-none focus:ring-2 focus:ring-primary/20
          hover:border-gray-300
          cursor-pointer
          transition-colors duration-150
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <Filter size={14} strokeWidth={1.8} />
      </span>
    </div>
  );
};

export default FilterDropdown;