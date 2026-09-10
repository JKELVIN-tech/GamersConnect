import { useEffect, useState } from 'react';
import { api } from '../api';
import { categoryColor } from '../categories';

export default function Players({ games }) {
  const [filter, setFilter] = useState('all');
  const [players, setPlayers] = useState([]);
  const [connected, setConnected] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.players(filter === 'all' ? undefined : filter)
      .then(setPlayers)
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [filter]);

  async function toggleConnect(userId) {
    try {
      const { connected: isConnected } = await api.connect(userId);
      setConnected((prev) => ({ ...prev, [userId]: isConnected }));
    } catch {
      // no-op — button just won't flip if the request fails
    }
  }

  return (
    <div className="tab-panel">
      <div className="section-title">Find players</div>
      <div className="section-sub">Filter by game to find people to squad up with</div>

      <div className="dt-players-layout">
        <div className="dt-filter-col">
          <div className="filter-scroll">
            <div
              className={`filter-chip${filter === 'all' ? ' active' : ''}`}
              style={filter === 'all' ? { background: 'var(--red)' } : {}}
              onClick={() => setFilter('all')}
            >All games</div>
            {games.map((g) => (
              <div
                key={g.id}
                className={`filter-chip${filter === g.id ? ' active' : ''}`}
                style={filter === g.id ? { background: `var(--${categoryColor(g.category)})` } : {}}
                onClick={() => setFilter(g.id)}
              >{g.name}</div>
            ))}
          </div>
        </div>

        <div>
          {loading && <div className="section-sub">Loading players…</div>}
          {!loading && players.length === 0 && (
            <div className="section-sub">No players found for this game yet — be the first to post in its forum.</div>
          )}
          <div id="player-list">
            {players.map((p) => (
              <div className="player-row" key={p.userId}>
                <div className="p-avatar" style={{ background: `var(--${categoryColor(p.game.category)})` }}>
                  {p.gamerTag.slice(0, 2).toUpperCase()}
                  {p.online && <div className="online-dot" />}
                </div>
                <div className="p-info">
                  <div className="pname">{p.gamerTag}</div>
                  <div className="pmeta mono">{p.game.name} · {p.rank ? `[${p.rank.toUpperCase()}]` : '[UNRANKED]'} · {p.county || 'Kenya'}</div>
                </div>
                <button
                  className={`connect-btn${connected[p.userId] ? ' sent' : ''}`}
                  onClick={() => toggleConnect(p.userId)}
                >{connected[p.userId] ? 'Requested' : 'Connect'}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
