const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        border-gray-200
        border-t-primary
        animate-spin
        ${className}
      `}
    />
  );
};

export default LoadingSpinner;