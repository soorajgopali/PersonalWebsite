export default function ProfileImage({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="200" height="200" fill="#0B0D12" />

      {/* Straw hat */}
      <ellipse cx="100" cy="70" rx="55" ry="18" fill="#D4A03C" />
      <ellipse cx="100" cy="65" rx="50" ry="15" fill="#E8B84B" />
      <rect x="55" y="55" width="90" height="20" rx="3" fill="#C49030" />
      <path d="M 60 75 Q 100 95 140 75" stroke="#8B5E14" strokeWidth="3" fill="none" />

      {/* Face */}
      <ellipse cx="100" cy="115" rx="38" ry="42" fill="#F5D0A9" />

      {/* Hair */}
      <path d="M 62 100 Q 70 70 100 65 Q 130 70 138 100" fill="#1A1A1A" />
      <path d="M 62 100 Q 60 85 75 80" fill="#1A1A1A" />
      <path d="M 138 100 Q 140 85 125 80" fill="#1A1A1A" />

      {/* Eyes */}
      <ellipse cx="85" cy="115" rx="6" ry="7" fill="#FFFFFF" />
      <ellipse cx="115" cy="115" rx="6" ry="7" fill="#FFFFFF" />
      <circle cx="86" cy="116" r="3" fill="#1A1A1A" />
      <circle cx="114" cy="116" r="3" fill="#1A1A1A" />
      <circle cx="87" cy="114" r="1" fill="#FFFFFF" />
      <circle cx="113" cy="114" r="1" fill="#FFFFFF" />

      {/* Eyebrows */}
      <path d="M 78 106 Q 85 102 92 106" stroke="#1A1A1A" strokeWidth="2" fill="none" />
      <path d="M 108 106 Q 115 102 122 106" stroke="#1A1A1A" strokeWidth="2" fill="none" />

      {/* Nose */}
      <path d="M 100 118 L 98 128 L 102 128 Z" fill="#D4A88C" />

      {/* Smile */}
      <path d="M 88 135 Q 100 145 112 135" stroke="#8B5E14" strokeWidth="2" fill="none" />

      {/* Scar under left eye */}
      <path d="M 80 125 L 82 128 M 80 128 L 82 131" stroke="#C4956A" strokeWidth="1" />

      {/* Body / Shirt */}
      <path d="M 65 160 Q 100 145 135 160 L 140 200 L 60 200 Z" fill="#CC2222" />
      <path d="M 65 160 Q 100 145 135 160" fill="#AA1111" />

      {/* Collar */}
      <path d="M 85 155 L 100 165 L 115 155" stroke="#FFFFFF" strokeWidth="2" fill="none" />

      {/* Coat open */}
      <line x1="100" y1="165" x2="100" y2="200" stroke="#AA1111" strokeWidth="2" />

      {/* Chests scar */}
      <path d="M 88 172 L 112 172" stroke="#C4956A" strokeWidth="1.5" />
      <path d="M 90 172 L 89 178 M 110 172 L 111 178" stroke="#C4956A" strokeWidth="1" />

      {/* Belt */}
      <rect x="65" y="188" width="70" height="8" fill="#8B5E14" />
      <rect x="92" y="186" width="16" height="12" rx="2" fill="#D4A03C" />

      {/* Subtle glow effect */}
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill="url(#glow)" />

      {/* Text hint for replacement */}
      <text x="100" y="197" textAnchor="middle" fontSize="5" fill="#9A9AA3" opacity="0.4" fontFamily="monospace">
        REPLACE WITH PHOTO
      </text>
    </svg>
  );
}
