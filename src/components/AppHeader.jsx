import { useNavigate } from 'react-router-dom';

export default function AppHeader({ user }) {
  const navigate = useNavigate();
  const initials = user ? user.gamerTag.slice(0, 2).toUpperCase() : '?';

  return (
    <div className="app-header">
      <div className="logo display">Gamer<span>Connect</span></div>
      <button
        className="avatar-btn"
        style={{ background: 'var(--red)' }}
        onClick={() => navigate('/profile')}
      >
        {initials}
      </button>
    </div>
  );
}
