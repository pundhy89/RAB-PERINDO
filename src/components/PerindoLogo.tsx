import React from 'react';

interface PerindoLogoProps {
  className?: string;
  size?: number;
}

export const PerindoLogo: React.FC<PerindoLogoProps> = ({ className = '', size = 48 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Background shield/circle */}
        <circle cx="50" cy="50" r="48" fill="#0f2766" stroke="#2563eb" strokeWidth="2" />
        
        {/* Inner subtle glow ring */}
        <circle cx="50" cy="50" r="44" fill="#08183d" />

        {/* Dynamic Eagle / Garuda Wings - Perindo Style */}
        {/* Left Wing (Patriotic Crimson Red) */}
        <path
          d="M50 24C44 24 32 30 24 39C21 42 20 46 22 49C23 51 26 51 29 49C35 45 42 41 48 39L46 51C42 53 36 57 32 62C30 64 30 67 32 69C34 70 37 69 40 67C44 64 48 60 50 56V24Z"
          fill="#dc2626"
        />
        
        {/* Right Wing (Perindo Vibrant Royal Blue) */}
        <path
          d="M50 24C56 24 68 30 76 39C79 42 80 46 78 49C77 51 74 51 71 49C65 45 58 41 52 39L54 51C58 53 64 57 68 62C70 64 70 67 68 69C66 70 63 69 60 67C56 64 52 60 50 56V24Z"
          fill="#2563eb"
        />

        {/* Central Eagle Torso / Quill (Clean White) */}
        <path
          d="M50 22L53 34L50 48L47 34L50 22Z"
          fill="#ffffff"
        />

        {/* Golden Star / Symbol of Unity at crest */}
        <path
          d="M50 16L51.8 20.8H56.5L52.7 23.5L54.1 28.2L50 25.4L45.9 28.2L47.3 23.5L43.5 20.8H48.2L50 16Z"
          fill="#f59e0b"
        />

        {/* Lower Tail Feathers */}
        <path
          d="M50 56L54 74C52 75 48 75 46 74L50 56Z"
          fill="#f8fafc"
        />

        {/* Golden Base Arc */}
        <path
          d="M28 78C35 83 42 85 50 85C58 85 65 83 72 78"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
