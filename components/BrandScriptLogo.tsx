import React from 'react';

export interface BrandScriptLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'xl';
  align?: 'center' | 'left';
  showUnderline?: boolean;
  className?: string;
}

export const BrandScriptLogo: React.FC<BrandScriptLogoProps> = ({
  size = 'md',
  align = 'center',
  showUnderline = true,
  className = ''
}) => {
  // Ultra-fine, delicate luxury sizing (hairline strokes, elegant proportions)
  const sizeMap = {
    sm: {
      svgWidth: 'w-[90px] sm:w-[98px]',
      fontSizeAR: 36,
      fontSizeFragrance: 21,
      yAR: 30,
      yFragrance: 50,
      lineY: 57,
      lineWidth: 20
    },
    md: {
      svgWidth: 'w-[105px] sm:w-[118px]',
      fontSizeAR: 40,
      fontSizeFragrance: 23,
      yAR: 32,
      yFragrance: 53,
      lineY: 60,
      lineWidth: 24
    },
    lg: {
      svgWidth: 'w-[125px] sm:w-[140px]',
      fontSizeAR: 46,
      fontSizeFragrance: 26,
      yAR: 35,
      yFragrance: 58,
      lineY: 66,
      lineWidth: 28
    },
    hero: {
      svgWidth: 'w-[145px] sm:w-[170px]',
      fontSizeAR: 52,
      fontSizeFragrance: 29,
      yAR: 38,
      yFragrance: 64,
      lineY: 72,
      lineWidth: 32
    },
    xl: {
      svgWidth: 'w-[170px] sm:w-[200px]',
      fontSizeAR: 60,
      fontSizeFragrance: 34,
      yAR: 42,
      yFragrance: 72,
      lineY: 80,
      lineWidth: 38
    }
  }[size];

  const centerX = align === 'left' ? 40 : 75;
  const viewBoxWidth = align === 'left' ? 140 : 150;
  const textAnchor = align === 'left' ? 'start' : 'middle';
  const lineX1 = align === 'left' ? 40 : 75 - sizeMap.lineWidth / 2;
  const lineX2 = align === 'left' ? 40 + sizeMap.lineWidth : 75 + sizeMap.lineWidth / 2;

  return (
    <div 
      className={`inline-flex items-center select-none ${className}`}
      aria-label="AR Fragrance"
    >
      <svg
        viewBox={`0 0 ${viewBoxWidth} 68`}
        className={`${sizeMap.svgWidth} h-auto overflow-visible`}
        style={{
          fontFamily: "'Brittany Signature', 'Brittany', 'Alex Brush', 'Allura', 'Pinyon Script', cursive",
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility'
        }}
      >
        {/* AR - Upper Monogram in delicate fine cursive script */}
        <text
          x={centerX}
          y={sizeMap.yAR}
          textAnchor={textAnchor}
          fill="#f7efe5"
          style={{
            fontSize: `${sizeMap.fontSizeAR}px`,
            fontWeight: 300,
            letterSpacing: '0.015em'
          }}
          className="hover:fill-white transition-colors"
        >
          AR
        </text>

        {/* Fragrance - Lower Sub-line in delicate flowing cursive script */}
        <text
          x={centerX}
          y={sizeMap.yFragrance}
          textAnchor={textAnchor}
          fill="#eee0ce"
          style={{
            fontSize: `${sizeMap.fontSizeFragrance}px`,
            fontWeight: 300,
            letterSpacing: '0.025em'
          }}
          className="hover:fill-[#fbf2e9] transition-colors"
        >
          Fragrance
        </text>

        {/* Ultra-fine hairline underline */}
        {showUnderline && (
          <line
            x1={lineX1}
            y1={sizeMap.lineY}
            x2={lineX2}
            y2={sizeMap.lineY}
            stroke="#d8c0a4"
            strokeWidth="0.85"
            strokeLinecap="round"
            opacity="0.6"
          />
        )}
      </svg>
    </div>
  );
};
