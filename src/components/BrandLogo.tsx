export function BrandLogo({
  variant = "light",
  showWordmark = true,
  compact = false,
}: {
  variant?: "light" | "dark";
  showWordmark?: boolean;
  compact?: boolean;
}) {
  const isDark = variant === "dark";
  const primaryStroke = isDark ? "#FFFFFF" : "#111111";
  const accentStroke = isDark ? "#C6A46C" : "#8A672E";

  return (
    <span className="inline-flex items-center gap-3.5">
      {/* Architectural open-plot & AS monogram emblem */}
      <svg
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={compact ? "h-9 w-9 shrink-0" : "h-10 w-10 shrink-0 sm:h-11 sm:w-11"}
      >
        {/* Open-corner residential plot boundary frame */}
        <path
          d="M6 15V6H38V38H28"
          stroke={accentStroke}
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        <path
          d="M6 21V38H22"
          stroke={accentStroke}
          strokeWidth="1.5"
          strokeLinecap="square"
          strokeOpacity="0.45"
        />
        {/* Minimalist geometric 'A' architectural apex */}
        <path
          d="M12.5 30L19.5 13.5L26.5 30"
          stroke={primaryStroke}
          strokeWidth="1.75"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M15.2 24.5H23.8"
          stroke={accentStroke}
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        {/* Minimalist geometric 'S' horizon ribbon */}
        <path
          d="M31.5 15.5C31.5 14.1 30.2 13.5 28.4 13.5C26.5 13.5 25.4 14.4 25.4 15.8C25.4 17.3 26.8 17.9 28.6 18.4C30.5 18.9 32 19.7 32 21.5C32 23.2 30.4 24.2 28.3 24.2C26.5 24.2 25.2 23.5 24.8 22.3"
          stroke={primaryStroke}
          strokeWidth="1.5"
          strokeLinecap="square"
        />
        {/* Corner survey point marker */}
        <rect x="36.25" y="4.25" width="3.5" height="3.5" fill={accentStroke} />
      </svg>

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-serif font-semibold tracking-[0.14em] uppercase ${
              compact ? "text-sm sm:text-base" : "text-base sm:text-xl"
            } ${isDark ? "text-[#FFFFFF]" : "text-[#111111]"}`}
          >
            Avuthapuram Shiva
          </span>
          <span
            className={`mt-1 text-[9px] font-medium tracking-[0.28em] uppercase sm:text-[10px] ${
              isDark ? "text-[#C6A46C]" : "text-[#8A672E]"
            }`}
          >
            Real Estate
          </span>
        </span>
      )}
    </span>
  );
}

