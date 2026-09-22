import Button from './Button';
import { Plus } from 'lucide-react';

const PageHeader = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionIcon = Plus,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-[#12223a]">{title}</h1>
        {subtitle && (
          <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          icon={actionIcon}
          onClick={onAction}
          size="md"
          className="flex-shrink-0"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
