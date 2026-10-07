import React from 'react';

interface CharteLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  brand?: 'homes' | 'cars';
}

export const CharteLogo: React.FC<CharteLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtitle = false,
  brand = 'cars',
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-base', sub: 'text-[9px]' },
    md: { icon: 32, text: 'text-lg', sub: 'text-[10px]' },
    lg: { icon: 40, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 52, text: 'text-2xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size];

  // Stylized Monogram
  const Monogram = (
    <div
      className="flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00266B] via-[#0037A3] to-[#2563EB] text-white font-extrabold shadow-sm shrink-0 border border-blue-400/30"
      style={{ width: `${icon}px`, height: `${icon}px` }}
    >
      <span className="tracking-tighter font-serif italic text-sm">CC</span>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{Monogram}</div>;
  }

  const brandName = brand === 'cars' ? 'CHARTE CARS' : 'CHARTE HOMES';
  const subtitle = brand === 'cars' ? 'World Automobile Marketplace' : 'World Real Estate';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {Monogram}
      <div className="flex flex-col leading-none">
        <span className={`font-black tracking-tight text-white ${text}`}>
          {brandName}
        </span>
        {showSubtitle && (
          <span className={`tracking-wider uppercase text-blue-300 font-semibold mt-0.5 ${sub}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
