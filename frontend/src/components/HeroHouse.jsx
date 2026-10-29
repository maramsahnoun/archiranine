import { useEffect, useState } from "react";

export default function HeroHouse() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <svg
      className={`hero-house ${ready ? "is-ready" : ""}`}
      viewBox="0 0 400 340"
      role="img"
      aria-label="Illustration animée d’une villa contemporaine en construction signée ArchiRanin"
    >
      <defs>
        {/* Wall Gradients: Travertine & Warm Sand (#c0ab94 -> #fefefe) */}
        <linearGradient id="heroWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fefefe" />
          <stop offset="100%" stopColor="#d5c4b1" />
        </linearGradient>

        <linearGradient id="heroWallSide" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0ab94" />
          <stop offset="100%" stopColor="#9a836d" />
        </linearGradient>

        {/* Roof Gradient: Dark Walnut & Deep Espresso (#49321d -> #261609) */}
        <linearGradient id="heroRoof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a3d24" />
          <stop offset="100%" stopColor="#2e1d10" />
        </linearGradient>

        {/* Windows: Warm Interior Lighting (#fff3cf -> #896130) */}
        <linearGradient id="heroWindow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff8e2" />
          <stop offset="60%" stopColor="#f5c76c" />
          <stop offset="100%" stopColor="#896130" />
        </linearGradient>

        {/* Foundation: Stone & Travertine Plinth */}
        <linearGradient id="heroPlinth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#614e3e" />
          <stop offset="100%" stopColor="#3d2a19" />
        </linearGradient>
      </defs>

      {/* Foundation & Base */}
      <g className="part p-foundation">
        <polygon points="40,300 360,300 320,320 80,320" fill="#49321d" />
        <polygon points="20,290 380,290 360,300 40,300" fill="url(#heroPlinth)" />
      </g>

      {/* Ground Floor Walls */}
      <g className="part p-wall-back">
        <polygon points="90,180 90,290 310,290 310,180" fill="url(#heroWall)" />
      </g>
      <g className="part p-wall-left">
        <polygon points="90,180 40,205 40,300 90,290" fill="url(#heroWallSide)" />
      </g>
      <g className="part p-wall-right">
        <polygon points="310,180 360,205 360,300 310,290" fill="#a8927b" />
      </g>

      {/* Second Floor Volumes */}
      <g className="part p-floor2">
        <polygon points="110,110 110,180 290,180 290,110" fill="url(#heroWall)" />
        <polygon points="110,110 70,130 70,205 110,180" fill="url(#heroWallSide)" />
        <polygon points="290,110 330,130 330,205 290,180" fill="#9e8770" />
      </g>

      {/* Windows with Warm Interior Glow & Dark Frames */}
      <g className="part p-windows">
        <rect x="130" y="125" width="34" height="34" rx="2" fill="url(#heroWindow)" />
        <rect x="236" y="125" width="34" height="34" rx="2" fill="url(#heroWindow)" />
        <rect x="130" y="200" width="30" height="46" rx="2" fill="#3d2a19" />
        <rect x="240" y="200" width="30" height="46" rx="2" fill="#3d2a19" />
        <rect x="82" y="140" width="16" height="16" fill="url(#heroWindow)" />
        <rect x="302" y="140" width="16" height="16" fill="url(#heroWindow)" />
      </g>

      {/* Front Entrance Door: Rich Dark Walnut with Gold Bronze Handle */}
      <g className="part p-door">
        <rect x="185" y="245" width="34" height="45" rx="2" fill="#2d1b0f" />
        <circle cx="212" cy="269" r="2.5" fill="#896130" />
      </g>

      {/* Architectural Cantilever Roof */}
      <g className="part p-roof">
        <polygon points="60,110 340,110 300,80 100,80" fill="url(#heroRoof)" />
        <polygon points="60,110 100,80 100,92 60,122" fill="#22140a" />
      </g>

      {/* Landscape & Organic Accents (Warm Mediterranean greenery & terra cotta) */}
      <g className="part p-details">
        {/* Pool / Water reflection */}
        <ellipse cx="355" cy="295" rx="26" ry="10" fill="#896130" opacity="0.45" />
        {/* Olive tree foliage */}
        <circle cx="30" cy="270" r="16" fill="#586747" />
        <rect x="26" y="280" width="8" height="18" fill="#49321d" />
        <circle cx="380" cy="255" r="12" fill="#586747" />
        <rect x="377" y="262" width="6" height="14" fill="#49321d" />
      </g>

      {/* Architectural Crane: Gold Bronze Accent (#896130) */}
      <g className="part p-crane" stroke="#896130" strokeWidth="2.5" fill="none">
        <line x1="345" y1="10" x2="345" y2="120" />
        <line x1="345" y1="18" x2="230" y2="30" />
        <line x1="345" y1="18" x2="380" y2="24" />
        <line x1="270" y1="30" x2="270" y2="70" strokeDasharray="4 4" stroke="#c0ab94" />
      </g>

      <rect className="p-scanline" x="40" y="70" width="320" height="3" fill="url(#heroWindow)" opacity="0" />
    </svg>
  );
}
