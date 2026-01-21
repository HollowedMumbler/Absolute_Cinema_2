export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className={`${sizes[size]} relative`}>
        <span className="absolute -left-1 -top-1 opacity-50 blur-sm">🏁</span>
        <span className="relative z-10">🏁</span>
      </div>
      <div className={`${sizes[size]} relative -ml-2`}>
        <span className="absolute -right-1 -top-1 opacity-50 blur-sm">🌱</span>
        <span className="relative z-10">🌱</span>
      </div>
    </div>
  );
}
