import { useState } from 'react';
import { api, saveSession } from '../api';
import { CATEGORIES } from '../categories';

const COUNTIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu (Eldoret)', 'Kiambu', 'Machakos'];

export default function Auth({ games, onAuthed }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ gamerTag: '', email: '', password: '', county: 'Nairobi' });
  const [selectedGames, setSelectedGames] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleGame(id) {
    setSelectedGames((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  async function submitStep1(e) {
    e.preventDefault();
    setError('');
    if (!form.gamerTag || !form.email || !form.password) {
      setError('Fill in your gamer tag, email and password first');
      return;
    }
    if (mode === 'login') {
      await doLogin();
      return;
    }
    setStep(2);
  }

  async function doLogin() {
    setLoading(true);
    setError('');
    try {
      const { token, user } = await api.login({ email: form.email, password: form.password });
      saveSession(token, user);
      onAuthed(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function finishSignup() {
    if (selectedGames.length === 0) {
      setError('Pick at least one game');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { token, user } = await api.signup({ ...form, gameIds: selectedGames });
      saveSession(token, user);
      onAuthed(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="app-shell" style={{ paddingBottom: 40 }}>
      <div style={{
        padding: '48px 28px 28px',
        background: 'radial-gradient(circle at 15% 20%, rgba(140,58,58,0.22), transparent 45%), radial-gradient(circle at 85% 10%, rgba(107,42,42,0.18), transparent 40%)',
      }}>
        <div className="logo display" style={{ fontSize: 34 }}>Gamer<span>Connect</span></div>
        <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: 15, maxWidth: 300 }}>
          Find your squad, join the gist, share your best clips — Kenya's own corner for gamers.
        </p>
      </div>

      <div className="tab-panel">
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--border)', marginBottom: 22 }}>
          {['signup', 'login'].map((m) => (
            <div
              key={m}
              onClick={() => { setMode(m); setStep(1); setError(''); }}
              style={{
                paddingBottom: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer',
                color: mode === m ? 'var(--text)' : 'var(--muted)',
                borderBottom: mode === m ? '2px solid var(--red)' : '2px solid transparent',
              }}
            >
              {m === 'signup' ? 'Create account' : 'Log in'}
            </div>
          ))}
        </div>

        {error && <div className="error-text">{error}</div>}

        {step === 1 && (
          <form onSubmit={submitStep1}>
            <div className="field">
              <label>Gamer tag</label>
              <input value={form.gamerTag} onChange={(e) => setForm({ ...form, gamerTag: e.target.value })} placeholder="e.g. MaraSniper254" />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            </div>
            {mode === 'signup' && (
              <div className="field">
                <label>County</label>
                <select value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })}>
                  {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}
            <button className="btn-primary" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'signup' ? 'Continue' : 'Log in'}
            </button>
          </form>
        )}

        {step === 2 && mode === 'signup' && (
          <div>
            <span onClick={() => setStep(1)} style={{ color: 'var(--muted)', fontSize: 13, cursor: 'pointer', marginBottom: 16, display: 'inline-block' }}>&larr; Back</span>
            <div className="section-sub">Pick the games you play — this is how we match you with other players.</div>
            {CATEGORIES.map((cat) => {
              const inCat = games.filter((g) => g.category === cat.id);
              if (inCat.length === 0) return null;
              return (
                <div key={cat.id}>
                  <div className="category-header" style={{ color: `var(--${cat.color})` }}>{cat.label}</div>
                  <div className="category-grid">
                    {inCat.map((g) => (
                      <div
                        key={g.id}
                        className={`game-pick${selectedGames.includes(g.id) ? ' picked' : ''}`}
                        onClick={() => toggleGame(g.id)}
                      >
                        <div className="dot" style={{ background: `var(--${cat.color})` }} />
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{g.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <button className="btn-primary" style={{ marginTop: 8 }} disabled={loading || selectedGames.length === 0} onClick={finishSignup}>
              {loading ? 'Please wait…' : 'Enter the app'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
