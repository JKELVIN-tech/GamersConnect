import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { categoryColor } from '../categories';

export default function Discover({ user }) {
  const [clips, setClips] = useState([]);
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    api.clips().then((c) => setClips(c.slice(0, 4))).catch(() => {});
    api.threads().then((t) => setThreads(t.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="tab-panel">
      <div className="section-title">Sasa, {user.gamerTag.split(' ')[0]}</div>
      <div className="section-sub">Here's what's happening across the community</div>

      {/* On mobile this stacks top-to-bottom like before. On desktop, .dt-dashboard
          splits it into a real two-column layout — threads next to clips, not
          underneath them. */}
      <div className="dt-dashboard">
        <div>
          <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>Hot threads</div>
          {threads.length === 0 && <div className="section-sub">No threads yet — start one in Forums.</div>}
          {threads.map((t) => (
            <Link to="/forums" key={t.id} className="thread-row" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="thread-bar" style={{ background: `var(--${categoryColor(t.game.category)})` }} />
              <div className="thread-body">
                <div className="thread-game" style={{ color: `var(--${categoryColor(t.game.category)})` }}>{t.game.name}</div>
                <div className="thread-title">{t.title}</div>
                <div className="thread-meta mono"><span>{t.author.gamerTag}</span><span>{t._count.replies} replies</span></div>
              </div>
            </Link>
          ))}
        </div>

        <div>
          <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>Trending clips</div>
          <div className="mini-row" style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
            {clips.length === 0 && <div className="section-sub">No clips yet — be the first to post one.</div>}
            {clips.map((c) => (
              <Link to="/clips" key={c.id} className="mini-card" style={{
                minWidth: 150, background: 'var(--surface)', borderRadius: 14, padding: 14,
                display: 'block', textDecoration: 'none', color: 'inherit', border: '1px solid var(--border)',
              }}>
                <div className="thumb" style={{
                  height: 80, borderRadius: 10, marginBottom: 8,
                  background: `linear-gradient(135deg, var(--${categoryColor(c.game.category)}), var(--surface-3))`,
                  display: 'flex', alignItems: 'flex-end', padding: 8, fontSize: 11, fontWeight: 700,
                }}>{c.game.name}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{c.title}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{c.uploader.gamerTag} · {c.views} views</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
