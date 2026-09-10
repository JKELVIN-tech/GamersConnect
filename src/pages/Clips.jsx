import { useEffect, useState } from 'react';
import { api, uploadClipFile } from '../api';
import { categoryColor } from '../categories';

export default function Clips({ games, user }) {
  const [clips, setClips] = useState([]);
  const [openClip, setOpenClip] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [newClip, setNewClip] = useState({ gameId: games[0]?.id || '', title: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  function loadClips() {
    api.clips().then(setClips).catch(() => {});
  }
  useEffect(loadClips, []);

  async function openClipDetail(c) {
    setOpenClip(c);
    const cm = await api.clipComments(c.id);
    setComments(cm);
  }

  async function like(c) {
    await api.likeClip(c.id);
    loadClips();
    if (openClip?.id === c.id) {
      setOpenClip((prev) => ({ ...prev, _count: { ...prev._count, likes: prev._count.likes + 1 } }));
    }
  }

  async function sendComment() {
    if (!commentText.trim()) return;
    const c = await api.commentOnClip(openClip.id, commentText.trim());
    setComments((prev) => [...prev, c]);
    setCommentText('');
  }

  async function submitUpload() {
    if (!newClip.title.trim() || !newClip.file) {
      setUploadError('Add a title and pick a video file');
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const publicUrl = await uploadClipFile(newClip.file);
      await api.createClip({ gameId: newClip.gameId, title: newClip.title, videoUrl: publicUrl });
      setShowUpload(false);
      setNewClip({ gameId: games[0]?.id || '', title: '', file: null });
      loadClips();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="tab-panel">
      <div className="section-title">Clips</div>
      <div className="section-sub">Watch what the community's been posting</div>

      <div className="upload-strip">
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Got a highlight?</div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 2 }}>Share your best play with everyone</div>
        </div>
        <button className="upload-btn" onClick={() => setShowUpload(true)}>Upload</button>
      </div>

      <div className="clips-grid">
        {clips.map((c) => (
          <div className="clip-card" key={c.id} onClick={() => openClipDetail(c)}>
            <div className="clip-thumb" style={{ background: `linear-gradient(135deg, var(--${categoryColor(c.game.category)}), var(--surface-3))` }}>
              <div className="play">▶</div>
            </div>
            <div className="clip-meta-box">
              <div className="ctitle">{c.title}</div>
              <div className="cstats"><span>{c.uploader.gamerTag}</span><span>♥ {c._count.likes}</span></div>
            </div>
          </div>
        ))}
      </div>

      {showUpload && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setShowUpload(false)}>
          <div className="overlay-panel">
            <div className="section-title" style={{ fontSize: 17 }}>Upload a clip</div>
            <div className="section-sub">
              Uploads go straight to storage from your browser — the file never passes through our server.
            </div>
            {uploadError && <div className="error-text">{uploadError}</div>}
            <div className="field">
              <label>Game</label>
              <select value={newClip.gameId} onChange={(e) => setNewClip({ ...newClip, gameId: e.target.value })}>
                {games.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Title</label>
              <input value={newClip.title} onChange={(e) => setNewClip({ ...newClip, title: e.target.value })} placeholder="e.g. Clutch 1v4 on Ascent" />
            </div>
            <div className="field">
              <label>Video file</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setNewClip({ ...newClip, file: e.target.files?.[0] || null })}
              />
            </div>
            <button className="btn-primary" onClick={submitUpload} disabled={uploading}>
              {uploading ? 'Uploading…' : 'Post clip'}
            </button>
            <button className="btn-ghost" onClick={() => setShowUpload(false)} disabled={uploading}>Cancel</button>
          </div>
        </div>
      )}

      {openClip && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setOpenClip(null)}>
          <div className="overlay-panel">
            <video
              src={openClip.videoUrl}
              controls
              style={{ width: '100%', borderRadius: 14, marginBottom: 16, background: '#000' }}
            />
            <div className="thread-game" style={{ color: `var(--${categoryColor(openClip.game.category)})` }}>{openClip.game.name}</div>
            <div className="section-title" style={{ marginTop: 4, fontSize: 17 }}>{openClip.title}</div>
            <div className="section-sub">Posted by {openClip.uploader.gamerTag}</div>
            <button className="connect-btn" style={{ marginBottom: 16 }} onClick={() => like(openClip)}>♥ {openClip._count.likes} likes</button>
            {comments.map((c) => (
              <div className="comment-item" key={c.id}>
                <div className="p-avatar" style={{ background: 'var(--crimson)' }}>{c.user.gamerTag.slice(0, 2).toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{c.user.gamerTag}</div>
                  <div style={{ fontSize: 13, marginTop: 2 }}>{c.text}</div>
                </div>
              </div>
            ))}
            <div className="reply-box">
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Comment on this clip..." />
              <button onClick={sendComment}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
