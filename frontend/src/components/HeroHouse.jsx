import { useEffect, useState } from "react";

export default function HeroHouse() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <svg className={`hero-house ${ready ? "is-ready" : ""}`} viewBox="0 0 400 340" role="img" aria-label="Illustration animée d’une maison moderne en construction">
      <defs>
        <linearGradient id="heroWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#edf2f8"/><stop offset="100%" stopColor="#cbd5e2"/></linearGradient>
        <linearGradient id="heroWallSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#b8c5d7"/><stop offset="100%" stopColor="#8797ae"/></linearGradient>
        <linearGradient id="heroRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#24364c"/><stop offset="100%" stopColor="#101a29"/></linearGradient>
        <linearGradient id="heroWindow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff0b8"/><stop offset="100%" stopColor="#e9a946"/></linearGradient>
      </defs>
      <g className="part p-foundation"><polygon points="40,300 360,300 320,320 80,320" fill="#394a5e"/><polygon points="20,290 380,290 360,300 40,300" fill="#52647b"/></g>
      <g className="part p-wall-back"><polygon points="90,180 90,290 310,290 310,180" fill="url(#heroWall)"/></g>
      <g className="part p-wall-left"><polygon points="90,180 40,205 40,300 90,290" fill="url(#heroWallSide)"/></g>
      <g className="part p-wall-right"><polygon points="310,180 360,205 360,300 310,290" fill="#9baac0"/></g>
      <g className="part p-floor2"><polygon points="110,110 110,180 290,180 290,110" fill="url(#heroWall)"/><polygon points="110,110 70,130 70,205 110,180" fill="url(#heroWallSide)"/><polygon points="290,110 330,130 330,205 290,180" fill="#95a4b9"/></g>
      <g className="part p-windows"><rect x="130" y="125" width="34" height="34" rx="2" fill="url(#heroWindow)"/><rect x="236" y="125" width="34" height="34" rx="2" fill="url(#heroWindow)"/><rect x="130" y="200" width="30" height="46" rx="2" fill="#203044"/><rect x="240" y="200" width="30" height="46" rx="2" fill="#203044"/><rect x="82" y="140" width="16" height="16" fill="url(#heroWindow)"/><rect x="302" y="140" width="16" height="16" fill="url(#heroWindow)"/></g>
      <g className="part p-door"><rect x="185" y="245" width="34" height="45" rx="2" fill="#1d2d40"/><circle cx="212" cy="269" r="2" fill="#e9b968"/></g>
      <g className="part p-roof"><polygon points="60,110 340,110 300,80 100,80" fill="url(#heroRoof)"/><polygon points="60,110 100,80 100,92 60,122" fill="#101a29"/></g>
      <g className="part p-details"><ellipse cx="355" cy="295" rx="26" ry="10" fill="#2d6a9b" opacity=".65"/><circle cx="30" cy="270" r="16" fill="#348264"/><rect x="26" y="280" width="8" height="18" fill="#76583a"/><circle cx="380" cy="255" r="12" fill="#348264"/><rect x="377" y="262" width="6" height="14" fill="#76583a"/></g>
      <g className="part p-crane" stroke="#8da0b4" strokeWidth="3" fill="none"><line x1="345" y1="10" x2="345" y2="120"/><line x1="345" y1="18" x2="230" y2="30"/><line x1="345" y1="18" x2="380" y2="24"/><line x1="270" y1="30" x2="270" y2="70" strokeDasharray="4 4"/></g>
      <rect className="p-scanline" x="40" y="70" width="320" height="4" fill="url(#heroWindow)" opacity="0"/>
    </svg>
  );
}
