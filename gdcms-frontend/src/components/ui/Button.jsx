const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  onClick,
  className = '',
  icon: Icon,
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-[#12223a] hover:bg-[#1a2e4a] text-white',
    secondary: 'bg-white hover:bg-gray-50 text-[#12223a] border border-gray-200',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizes = {
    sm: 'text-xs px-3 py-2',
    md: 'text-sm px-4 py-2.5',
    lg: 'text-sm px-5 py-3',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      ) : (
        Icon && <Icon size={16} strokeWidth={2} />
      )}
      {children}
    </button>
  );
};

export default Button;
