export function GoddessMark({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 5c-7 8-7 12 0 17 7-5 7-9 0-17Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 29c8-6 16-5 22 3-9 4-16 2-22-3Zm48 0c-8-6-16-5-22 3 9 4 16 2 22-3Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M15 28c3 6 7 7 10 2m24-2c-3 6-7 7-10 2M32 31v12l-3 2m-3 7c4 3 8 3 12 0M5 21c8-6 17-5 24 1m30-1c-8-6-17-5-24 1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="26" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function Alpona({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="300"
        cy="300"
        r="286"
        stroke="currentColor"
        strokeWidth=".7"
      />
      <circle
        cx="300"
        cy="300"
        r="267"
        stroke="currentColor"
        strokeWidth=".7"
        strokeDasharray="1 7"
      />
      <circle
        cx="300"
        cy="300"
        r="241"
        stroke="currentColor"
        strokeWidth=".6"
      />
      {Array.from({ length: 32 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 11.25} 300 300)`}>
          <path
            d="M300 22Q279 58 300 76Q321 58 300 22ZM300 78v20M294 90l6 7 6-7"
            stroke="currentColor"
            strokeWidth=".8"
          />
          <circle cx="300" cy="9" r="1.7" fill="currentColor" />
        </g>
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <path
          key={i}
          d="M300 118Q251 154 300 208Q349 154 300 118Z"
          transform={`rotate(${i * 22.5} 300 300)`}
          stroke="currentColor"
          strokeWidth=".55"
        />
      ))}
      <circle
        cx="300"
        cy="300"
        r="100"
        stroke="currentColor"
        strokeWidth=".7"
      />
    </svg>
  );
}
