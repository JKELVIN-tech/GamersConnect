import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, clearSession } from '../api';
import { categoryColor } from '../categories';

const PLATFORMS = [
  { id: 'psn', name: 'PlayStation Network', icon: 'PS', oauth: false },
  { id: 'xbox', name: 'Xbox Live', icon: 'XB', oauth: true },
  { id: 'steam', name: 'Steam', icon: 'ST', oauth: true },
  { id: 'epic', name: 'Epic Games (Fortnite)', icon: 'EP', oauth: true },
];

export default function Profile({ user, setUser }) {
  const [me, setMe] = useState(user);
  const [linked, setLinked] = useState([]);
  const [params] = useSearchParams();

  function loadLinked() {
    api.linkedAccounts().then(setLinked).catch(() => {});
  }
  useEffect(() => {
    api.me().then(setMe).catch(() => {});
    loadLinked();
  }, []);

  const justLinked = params.get('linked');
  const linkError = params.get('linkError');

  async function startLink(pf) {
    if (!pf.oauth) {
      const tag = prompt(`Enter your ${pf.name} ID:`);
      if (!tag) return;
      await api.linkPsn(tag);
      loadLinked();
      return;
    }
    // Real OAuth / OpenID: get the provider's auth URL, then send the whole browser there.
    // The provider redirects back to the backend, which redirects here again once linked.
    try {
      const { redirectUrl } = await api.startOAuthLink(pf.id);
      window.location.href = redirectUrl;
    } catch (err) {
      alert(err.message);
    }
  }

  async function unlink(platform) {
    await api.unlinkAccount(platform);
    loadLinked();
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return (
    <div className="tab-panel">
      <div className="profile-head">
        <div className="p-avatar" style={{ width: 76, height: 76, fontSize: 24, background: 'var(--red)' }}>
          {me.gamerTag.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{me.gamerTag}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{me.county || 'Kenya'}</div>
        <div className="profile-games">
          {(me.gameProfiles || []).map((gp) => (
            <div key={gp.gameId} className="tag" style={{ borderColor: `var(--${categoryColor(gp.game.category)})` }}>
              {gp.game.name}
            </div>
          ))}
        </div>
      </div>

      {justLinked && <div className="section-sub" style={{ color: 'var(--rust)' }}>Linked your {justLinked} account.</div>}
      {linkError && <div className="error-text">Couldn't link {linkError} — check the backend logs and its env vars.</div>}

      <div style={{ marginBottom: 8 }}>
        <div className="section-title" style={{ fontSize: 15, marginBottom: 4 }}>Linked accounts</div>
        <div className="section-sub">
          Xbox, Steam and Epic link for real via their sign-in. PlayStation has no public linking
          API, so that one's self-reported.
        </div>
        {PLATFORMS.map((pf) => {
          const l = linked.find((x) => x.platform === pf.id);
          return (
            <div className="platform-row" key={pf.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="pf-icon">{pf.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{pf.name}</div>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>
                    {l ? `${l.tag}${l.verified ? '  ✓ verified' : ''}` : 'Not linked'}
                  </div>
                </div>
              </div>
              <button
                className={`connect-btn${l ? ' sent' : ''}`}
                onClick={() => (l ? unlink(pf.id) : startLink(pf))}
              >
                {l ? 'Unlink' : pf.oauth ? 'Sign in to link' : 'Link account'}
              </button>
            </div>
          );
        })}
      </div>

      <button className="btn-ghost" onClick={logout}>Log out</button>
    </div>
  );
}
