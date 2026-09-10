import { NavLink } from 'react-router-dom';

// A genuine desktop sidebar — not the bottom tab bar repositioned. Logo at top,
// vertical nav list, user chip pinned to the bottom. Only rendered/visible at
// desktop widths (see .desktop-nav in theme.css); BottomNav still handles mobile.
const LINKS = [
  { to: '/', label: 'Discover', icon: '⌂', end: true },
  { to: '/players', label: 'Players', icon: '◎' },
  { to: '/forums', label: 'Forums', icon: '☰' },
  { to: '/clips', label: 'Clips', icon: '▶' },
];

export default function Sidebar({ user }) {
  const initials = user ? user.gamerTag.slice(0, 2).toUpperCase() : '?';

  return (
    <div className="desktop-nav">
      <div className="dn-logo display">Gamer<span>Connect</span></div>

      <nav className="dn-links">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `dn-link${isActive ? ' active' : ''}`}
          >
            <span className="dn-icon">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <NavLink to="/profile" className={({ isActive }) => `dn-user${isActive ? ' active' : ''}`}>
        <div className="p-avatar" style={{ width: 32, height: 32, fontSize: 12, background: 'var(--red)' }}>
          {initials}
        </div>
        <div className="dn-user-name">{user?.gamerTag}</div>
      </NavLink>
    </div>
  );
}
