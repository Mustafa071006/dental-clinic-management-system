import { useState } from 'react';

/**
 * Image with lazy loading, a skeleton placeholder, and a fade-in on load —
 * avoids layout shift and blank flashes for avatars/photos.
 */
const LazyImage = ({ src, alt = '', className = '', imgClassName = '' }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && <div className="skeleton absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${imgClassName} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default LazyImage;
