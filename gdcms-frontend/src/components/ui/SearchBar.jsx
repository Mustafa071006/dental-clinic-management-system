import { Search } from 'lucide-react';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Cari...',
  className = '',
}) => {
  return (
    <div className={`relative group ${className}`}>
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#12223a] transition-colors duration-150 pointer-events-none">
        <Search size={16} strokeWidth={1.8} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="
          w-full pl-10 pr-4 py-2.5 text-sm
          border border-gray-200 rounded-xl
          bg-white text-[#12223a] placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-gray-300
          transition-colors duration-150
        "
      />
    </div>
  );
};

export default SearchBar;
