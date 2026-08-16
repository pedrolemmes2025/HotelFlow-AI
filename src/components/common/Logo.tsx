import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'dark' | 'light' | 'gold';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'dark',
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 38, text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 48, text: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-base' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Monogram HF matching Image 9 */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C5A059" />
            <stop offset="50%" stopColor="#E5C788" />
            <stop offset="100%" stopColor="#A88338" />
          </linearGradient>
          <linearGradient id="navyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#1C2541" />
          </linearGradient>
        </defs>

        {/* Left vertical stem with subtle inner gold chamfer */}
        <path
          d="M26 28C26 24 29 22 34 22H39C43 22 46 25 46 30V94C46 98 43 100 38 100H32C28 100 26 97 26 92V28Z"
          fill="url(#navyGradient)"
        />
        <path
          d="M26 65C26 65 34 78 38 96C42 98 44 97 45 93C41 78 33 65 26 65Z"
          fill="url(#goldGradient)"
        />

        {/* Dynamic sweeping H to F crosswave */}
        <path
          d="M28 58C46 58 52 38 72 26C84 19 96 22 102 24C104 25 102 32 94 33C80 35 68 46 58 64C50 78 48 98 48 98C46 98 42 94 40 86C45 68 56 56 68 48C56 54 44 58 28 58Z"
          fill="url(#goldGradient)"
        />

        {/* Neural AI Circuit nodes (flowing out of the F stem) */}
        {/* Branch 1 */}
        <path d="M68 48H86" stroke="#0B132B" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="90" cy="48" r="4.5" fill="#0B132B" />

        {/* Branch 2 - upper diag */}
        <path d="M72 44L84 34H96" stroke="#0B132B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="100" cy="34" r="4.5" fill="#0B132B" />

        {/* Branch 3 - mid down */}
        <path d="M64 56L78 64H92" stroke="#0B132B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="96" cy="64" r="4.5" fill="#0B132B" />

        {/* Branch 4 - lower down */}
        <path d="M60 66L72 78H88" stroke="#0B132B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="92" cy="78" r="4.5" fill="#0B132B" />

        {/* Branch 5 - extra node */}
        <path d="M82 64L88 56" stroke="#0B132B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="90" cy="54" r="3.5" fill="#0B132B" />

        {/* Solid Main F Body */}
        <path
          d="M52 46C60 38 72 26 92 24C95 24 96 28 92 30C76 34 64 45 56 60C50 72 48 88 48 88L44 86C45 74 48 56 52 46Z"
          fill="url(#navyGradient)"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline tracking-tight font-bold">
            <span
              className={`${currentSize.text} font-semibold ${
                variant === 'light' ? 'text-white' : 'text-slate-900'
              }`}
            >
              HotelFlow
            </span>
            <span className={`${currentSize.text} ml-1 font-bold text-[#b88e2f]`}>AI</span>
          </div>
        </div>
      )}
    </div>
  );
};
