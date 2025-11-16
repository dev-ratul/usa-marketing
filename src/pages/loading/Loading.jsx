// Loading.jsx
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#071126] to-[#0b2240] p-6">
      <div className="w-full max-w-xl text-center">
        {/* glowing logo */}
        <div className="mx-auto mb-6 w-28 h-28 rounded-full flex items-center justify-center
                        bg-gradient-to-tr from-[#38bdf8] to-[#7c3aed] shadow-[0_6px_30px_rgba(124,58,237,0.25)]
                        animate-pulse">
          <svg
            className="w-14 h-14 text-white drop-shadow-lg"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M12 2l3.5 6.5L22 10l-5 4 1.5 7L12 18l-6.5 3-1.5-7L3 10l6.5-1.5L12 2z" fill="currentColor" />
          </svg>
        </div>

        {/* title */}
        <h2 className="text-white text-2xl sm:text-3xl font-semibold mb-2">
          Loading, hang tight...
        </h2>
        <p className="text-gray-300/80 mb-6">
          Fetching premium data — this will only take a moment.
        </p>

        {/* animated bars (skeleton) */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative w-full h-4 rounded-full overflow-hidden bg-white/6"
            >
              <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                }}
              />
            </div>
          ))}
        </div>

        {/* small meta + dots */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="text-xs text-gray-400">Preparing secure view</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#60a5fa] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-[#60a5fa] animate-bounce animation-delay-200" />
            <span className="w-2 h-2 rounded-full bg-[#60a5fa] animate-bounce animation-delay-400" />
          </div>
        </div>

        {/* accessibility: hidden live region */}
        <div className="sr-only" aria-live="polite">
          Loading content, please wait.
        </div>
      </div>

      {/* Tailwind custom animation (inserted inline for convenience) */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-[shimmer_1.4s_infinite] {
          animation: shimmer 1.4s infinite;
        }
        .animation-delay-200 { animation-delay: 0.12s; }
        .animation-delay-400 { animation-delay: 0.24s; }
      `}</style>
    </div>
  );
};

export default Loading;
