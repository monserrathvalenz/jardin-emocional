export function BotanicalOrnament({ className = '', style = {} }) {
  return (
    <svg className={className} style={style} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M50 10 Q 50 30 50 50" />
      <path d="M50 50 Q 30 40 20 30 Q 15 25 18 20" />
      <path d="M50 50 Q 70 40 80 30 Q 85 25 82 20" />
      <ellipse cx="22" cy="22" rx="4" ry="6" transform="rotate(-30 22 22)" />
      <ellipse cx="78" cy="22" rx="4" ry="6" transform="rotate(30 78 22)" />
      <circle cx="50" cy="50" r="4" />
      <path d="M50 50 Q 50 70 50 90" />
      <ellipse cx="42" cy="75" rx="3" ry="5" transform="rotate(-20 42 75)" />
      <ellipse cx="58" cy="75" rx="3" ry="5" transform="rotate(20 58 75)" />
    </svg>
  );
}

export function Sprout({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22V12" />
      <path d="M12 12 C 8 10, 6 6, 8 3 C 11 4, 12 8, 12 12" />
      <path d="M12 12 C 16 10, 18 6, 16 3 C 13 4, 12 8, 12 12" />
    </svg>
  );
}

export function Leaf({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10v-2a7 7 0 0 1-1 0z" />
      <path d="M14.5 8.5c.5-.5 1.5-1 2.5-1.5 3-1.5 5-3 5-3s-.5 5-3 8-7 4-7 4 1-5 2.5-7.5z" />
    </svg>
  );
}
