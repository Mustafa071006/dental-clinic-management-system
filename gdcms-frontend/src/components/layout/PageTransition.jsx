import { useLocation } from 'react-router-dom';

/**
 * Lightweight fade+rise on route change — remounts (via the pathname key)
 * so the CSS animation replays without a heavier transition library.
 */
const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="animate-fadeInUp">
      {children}
    </div>
  );
};

export default PageTransition;
