import { useEffect, useState } from 'react';
import { api } from '../api';
import { CATEGORIES, categoryColor } from '../categories';

export default function Forums({ games, user }) {
  const [threads, setThreads] = useState([]);
  const [openThread, setOpenThread] = useState(null); // full thread w/ replies
  const [replyText, setReplyText] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newThread, setNewThread] = useState({ gameId: games[0]?.id || '', title: '', body: '' });

  function loadThreads() {
    api.threads().then(setThreads).catch(() => {});
  }
  useEffect(loadThreads, []);

  async function openThreadDetail(id) {
    const t = await api.thread(id);
    setOpenThread(t);
  }

  async function sendReply() {
    if (!replyText.trim()) return;
    const reply = await api.reply(openThread.id, replyText.trim());
    setOpenThread((prev) => ({ ...prev, replies: [...prev.replies, reply] }));
    setReplyText('');
    loadThreads();
  }

  async function submitNewThread() {
    if (!newThread.title.trim()) return;
    await api.createThread(newThread);
    setShowNew(false);
    setNewThread({ gameId: games[0]?.id || '', title: '', body: '' });
    loadThreads();
  }

  const threadListItems = (
    <>
      {threads.map((t) => (
        <div
          className="thread-row"
          key={t.id}
          style={{ cursor: 'pointer', background: openThread?.id === t.id ? 'var(--surface-3)' : 'transparent' }}
          onClick={() => openThreadDetail(t.id)}
        >
          <div className="thread-bar" style={{ background: `var(--${categoryColor(t.game.category)})` }} />
          <div className="thread-body">
            <div className="thread-game" style={{ color: `var(--${categoryColor(t.game.category)})` }}>{t.game.name}</div>
            <div className="thread-title">{t.title}</div>
            <div className="thread-meta mono"><span>{t.author.gamerTag}</span><span>{t._count.replies} replies</span></div>
          </div>
        </div>
      ))}
    </>
  );

  const threadDetailContent = openThread && (
    <>
      <div className="thread-game" style={{ color: `var(--${categoryColor(openThread.game.category)})` }}>{openThread.game.name}</div>
      <div className="section-title" style={{ marginTop: 6 }}>{openThread.title}</div>
      <div className="section-sub">Started by {openThread.author.gamerTag}</div>
      {openThread.replies.map((r) => (
        <div className="comment-item" key={r.id}>
          <div className="p-avatar" style={{ background: 'var(--crimson)' }}>{r.author.gamerTag.slice(0, 2).toUpperCase()}</div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>{r.author.gamerTag}</div>
            <div style={{ fontSize: 13, marginTop: 2 }}>{r.text}</div>
          </div>
        </div>
      ))}
      <div className="reply-box">
        <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Add a reply..." />
        <button onClick={sendReply}>Send</button>
      </div>
    </>
  );

  return (
    <div className="tab-panel">
      <div className="section-title">Forums</div>
      <div className="section-sub">Talk strategy, organise scrims, settle debates</div>

      <button className="new-thread-btn" onClick={() => setShowNew(true)}>+ Start a new thread</button>

      {/* Mobile: a single stacked thread list; tapping one opens the detail as a
          popup (below). Desktop: .dt-forums-layout splits this into a persistent
          list-on-the-left / detail-on-the-right pane — no popup needed, the
          selected thread just shows next to the list, like an actual forum. */}
      <div className="dt-forums-layout">
        <div className="dt-thread-list">{threadListItems}</div>
        <div className="dt-thread-detail">
          {openThread ? threadDetailContent : (
            <div className="dt-thread-detail-empty">
              <div className="big">☰</div>
              <div>Pick a thread on the left to read it</div>
            </div>
          )}
        </div>
      </div>

      {showNew && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowNew(false)}>
          <div className="overlay-panel">
            <div className="section-title" style={{ fontSize: 17 }}>Start a thread</div>
            <div className="section-sub">Ask a question, share tactics, find a scrim</div>
            <div className="field">
              <label>Game</label>
              <select value={newThread.gameId} onChange={(e) => setNewThread({ ...newThread, gameId: e.target.value })}>
                {CATEGORIES.map((cat) => {
                  const inCat = games.filter((g) => g.category === cat.id);
                  if (inCat.length === 0) return null;
                  return (
                    <optgroup label={cat.label} key={cat.id}>
                      {inCat.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </optgroup>
                  );
                })}
              </select>
            </div>
            <div className="field">
              <label>Title</label>
              <input value={newThread.title} onChange={(e) => setNewThread({ ...newThread, title: e.target.value })} placeholder="e.g. Best formation vs 4-3-3 spam?" />
            </div>
            <div className="field">
              <label>Details</label>
              <input value={newThread.body} onChange={(e) => setNewThread({ ...newThread, body: e.target.value })} placeholder="Say a bit more..." />
            </div>
            <button className="btn-primary" onClick={submitNewThread}>Post thread</button>
            <button className="btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Mobile-only popup for thread detail — hidden on desktop via .dt-mobile-only,
          since the pane above already shows it there. */}
      {openThread && (
        <div className="overlay dt-mobile-only" onClick={(e) => e.target === e.currentTarget && setOpenThread(null)}>
          <div className="overlay-panel">{threadDetailContent}</div>
        </div>
      )}
    </div>
  );
}
