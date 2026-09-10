import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Discover', icon: '⌂', end: true },
  { to: '/players', label: 'Players', icon: '◎' },
  { to: '/forums', label: 'Forums', icon: '☰' },
  { to: '/clips', label: 'Clips', icon: '▶' },
  { to: '/profile', label: 'Profile', icon: '☺' },
];

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <div>{t.icon}</div>
          <div>{t.label}</div>
        </NavLink>
      ))}
    </div>
  );
}
