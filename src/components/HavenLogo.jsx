// Haven logo: a swallow flying over planet Earth, with a dotted flight trail.
const BIRD =
  'M93 33 L85 30.5 C80 28.5 75 29 71 31.5 C64 24 52 13 30 6 C45 17 55 28 61 36.5 C55 39.5 47 42 38 43 L2 35 L33 47.5 L8 64 L42 50 C50 50 56 50.5 61 49.5 C62 58 57 69 46 80 C62 72 70 60 70 47 C76 45 80 42 83 37 Z'

export function HavenMark({ size = 36, bg = '#6C47FF', fg = '#fff', rounded = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} role="img" aria-label="Haven">
      <rect width="64" height="64" rx={rounded} fill={bg} />
      <g fill="none" stroke={fg} strokeLinecap="round">
        <circle cx="27" cy="43" r="14.5" strokeWidth="2.4" />
        <path d="M27 28.5 C20 34.5 20 51.5 27 57.5 C34 51.5 34 34.5 27 28.5" strokeWidth="1.9" />
        <path d="M13.4 38 C22 41 32 41 40.6 38 M13.4 48 C22 45 32 45 40.6 48" strokeWidth="1.9" />
        <path d="M9 31 C11 22 18 16 27 14" strokeWidth="2.6" strokeDasharray="0.1 4.4" />
      </g>
      <g transform="translate(28 -0.5) scale(0.355) rotate(-12 50 50)">
        <path fill={bg} stroke={bg} strokeWidth="10" strokeLinejoin="round" d={BIRD} />
        <path fill={fg} d={BIRD} />
      </g>
    </svg>
  )
}

export function HavenWordmark({ size = 36, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <HavenMark size={size} rounded={17} />
      <span className="font-extrabold tracking-[-0.035em]" style={{ fontSize: size * 0.68 }}>
        haven
      </span>
    </div>
  )
}
