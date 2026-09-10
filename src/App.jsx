import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { api, getSessionUser } from './api';
import AppHeader from './components/AppHeader.jsx';
import BottomNav from './components/BottomNav.jsx';
import Sidebar from './components/Sidebar.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import Auth from './pages/Auth.jsx';
import Discover from './pages/Discover.jsx';
import Players from './pages/Players.jsx';
import Forums from './pages/Forums.jsx';
import Clips from './pages/Clips.jsx';
import Profile from './pages/Profile.jsx';

const MIN_SPLASH_MS = 1100; // keeps the splash from just flashing on fast connections

export default function App() {
  const [user, setUser] = useState(getSessionUser());
  const [games, setGames] = useState([]);
  const [booting, setBooting] = useState(true);
  const [splashLeaving, setSplashLeaving] = useState(false);

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS));
    const gamesFetch = api.games().then(setGames).catch(() => setGames([]));

    Promise.all([minDelay, gamesFetch]).then(() => {
      setSplashLeaving(true);
      setTimeout(() => setBooting(false), 400); // matches the CSS fade-out duration
    });
  }, []);

  if (booting) {
    return <SplashScreen leaving={splashLeaving} />;
  }

  if (!user) {
    return <Auth games={games} onAuthed={setUser} />;
  }

  return (
    <div id="app-shell" className="app-shell-main">
      <Sidebar user={user} />
      <div className="dt-main">
        <AppHeader user={user} />
        <Routes>
          <Route path="/" element={<Discover user={user} />} />
          <Route path="/players" element={<Players games={games} />} />
          <Route path="/forums" element={<Forums games={games} user={user} />} />
          <Route path="/clips" element={<Clips games={games} user={user} />} />
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  );
}
