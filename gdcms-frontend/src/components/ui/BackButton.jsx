import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ to, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Go back"
      className={`p-1 rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-150 text-[#12223a] ${className}`}
    >
      <ArrowLeft size={20} strokeWidth={2} />
    </button>
  );
};

export default BackButton;