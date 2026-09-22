import { getInitials } from '../../utils/getInitials';
import LazyImage from './LazyImage';

const PatientAvatar = ({ name, imageUrl, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  if (imageUrl) {
    return (
      <LazyImage
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full flex-shrink-0`}
        imgClassName="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gray-200
        text-gray-600
        font-semibold
        flex items-center justify-center
        flex-shrink-0
      `}
    >
      {getInitials(name)}
    </div>
  );
};

export default PatientAvatar;
