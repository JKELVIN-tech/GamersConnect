import { useEffect, useState } from 'react';

// Flavor text while the app boots — a small nod to loading screens in the games
// themselves. Purely cosmetic; the actual readiness check lives in App.jsx.
const LOADING_LINES = [
  'Connecting to the network…',
  'Loading your squad list…',
  'Syncing the game library…',
  'Warming up the servers…',
];

export default function SplashScreen({ leaving }) {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIndex((i) => (i + 1) % LOADING_LINES.length);
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`splash-screen${leaving ? ' leaving' : ''}`}>
      <div className="splash-bracket tl" />
      <div className="splash-bracket br" />
      <div className="splash-logo display">Gamer<span>Connect</span></div>
      <div className="splash-tagline">Kenya's gaming corner</div>
      <div className="splash-bar"><div className="splash-bar-fill" /></div>
      <div className="splash-status mono">{LOADING_LINES[lineIndex]}</div>
    </div>
  );
}
