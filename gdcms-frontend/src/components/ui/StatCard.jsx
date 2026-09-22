const StatCard = ({
  label,
  value,
  icon: Icon,
  badge,
  iconColor = 'text-gray-400',
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Top row: ikon + badge */}
      <div className="flex items-start justify-between">
        <div className={`${iconColor}`}>
          {Icon && <Icon size={22} strokeWidth={1.5} />}
        </div>
        {badge && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>

      {/* Label */}
      <p className="text-gray-500 text-sm">{label}</p>

      {/* Value */}
      {isLoading ? (
        <div className="skeleton h-8 w-12 rounded" />
      ) : (
        <p className="text-[#12223a] font-bold text-3xl leading-none animate-fadeIn">
          {value ?? '-'}
        </p>
      )}
    </div>
  );
};

export default StatCard;