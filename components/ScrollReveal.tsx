import React, { useEffect, useRef, useState } from 'react';

export type RevealAnimation = 'fade-up' | 'fade-down' | 'fade-in' | 'scale';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: RevealAnimation;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  className = '',
  as: Component = 'div',
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Respect user's motion preferences
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, rootMargin, once]);

  const animationClass = {
    'fade-up': 'scroll-reveal-fade-up',
    'fade-down': 'scroll-reveal-fade-down',
    'fade-in': 'scroll-reveal-fade-in',
    'scale': 'scroll-reveal-scale',
  }[animation];

  const inlineStyles: React.CSSProperties = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <Component
      ref={elementRef}
      style={inlineStyles}
      className={`scroll-reveal ${animationClass} ${isVisible ? 'scroll-reveal-visible' : ''} ${className}`}
    >
      {children}
    </Component>
  );
};
