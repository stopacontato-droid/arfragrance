import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  rootMargin?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  rootMargin = '250px 0px',
  aspectRatio,
  fallbackSrc,
  ...props
}) => {
  const [isInView, setIsInView] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // If priority is set, load immediately; otherwise observe viewport proximity
  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (containerRef.current) {
                observer.unobserve(containerRef.current);
              }
            }
          });
        },
        { rootMargin }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
      };
    } else {
      setIsInView(true);
    }
  }, [priority, rootMargin]);

  // Validate src to ensure non-empty string
  const validSrc = typeof src === 'string' && src.trim() !== '' ? src.trim() : null;

  // Instant check for cached images and reset on src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [validSrc, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (!hasError && fallbackSrc && validSrc !== fallbackSrc) {
      // Try fallback once if specified
      if (imgRef.current) {
        imgRef.current.src = fallbackSrc;
      }
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden flex items-center justify-center ${
        aspectRatio ? aspectRatio : 'w-full h-full'
      } ${containerClassName}`}
    >
      {/* Premium Dark Luxury Shimmer Skeleton Placeholder */}
      {(!isLoaded || !validSrc) && (
        <div className="absolute inset-0 bg-[#151518] flex items-center justify-center pointer-events-none z-0">
          {/* Subtle gold ambient glow */}
          <div className="w-24 h-24 rounded-full bg-[#c5a880]/10 blur-xl animate-pulse" />
          {/* Shimmer sweep animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a880]/10 to-transparent animate-shimmer" />
          {/* Subtle luxury brand watermark shimmer */}
          <div className="opacity-15 flex flex-col items-center">
            <div className="w-6 h-6 rounded-full border border-[#c5a880]/30" />
          </div>
        </div>
      )}

      {/* Actual Image when in viewport vicinity and src is valid */}
      {isInView && !hasError && validSrc ? (
        <img
          ref={imgRef}
          src={validSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      ) : null}

      {/* Graceful fallback if image fails */}
      {hasError && (
        <div className="flex flex-col items-center justify-center text-[#787163] text-xs p-3 text-center">
          <span className="font-serif text-[#d6cfc2] text-xs line-clamp-1">{alt}</span>
        </div>
      )}
    </div>
  );
};
