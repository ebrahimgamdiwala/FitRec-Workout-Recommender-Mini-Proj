'use client';

export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl ${
        hover ? 'hover:bg-white/10 transition-all duration-300 hover:scale-105' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
