// Thin fetch wrapper around the backend API.
// In dev, Vite proxies /api -> the local backend (see vite.config.js).
const BASE = '/api';

function getToken() {
  return localStorage.getItem('gc_token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : null;

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/users/me'),
  updateMe: (payload) => request('/users/me', { method: 'PATCH', body: payload }),
  games: () => request('/games', { auth: false }),
  players: (gameId) => request(`/players${gameId ? `?game=${encodeURIComponent(gameId)}` : ''}`),
  connect: (toUserId) => request('/connections', { method: 'POST', body: { toUserId } }),
  threads: (gameId) => request(`/threads${gameId ? `?game=${encodeURIComponent(gameId)}` : ''}`, { auth: false }),
  thread: (id) => request(`/threads/${encodeURIComponent(id)}`, { auth: false }),
  createThread: (payload) => request('/threads', { method: 'POST', body: payload }),
  reply: (threadId, text) => request(`/threads/${encodeURIComponent(threadId)}/replies`, { method: 'POST', body: { text } }),
  clips: (gameId) => request(`/clips${gameId ? `?game=${encodeURIComponent(gameId)}` : ''}`, { auth: false }),
  createClip: (payload) => request('/clips', { method: 'POST', body: payload }),
  getUploadUrl: (filename, contentType) => request('/clips/upload-url', { method: 'POST', body: { filename, contentType } }),
  likeClip: (id) => request(`/clips/${encodeURIComponent(id)}/like`, { method: 'POST' }),
  clipComments: (id) => request(`/clips/${encodeURIComponent(id)}/comments`, { auth: false }),
  commentOnClip: (id, text) => request(`/clips/${encodeURIComponent(id)}/comments`, { method: 'POST', body: { text } }),
  linkedAccounts: () => request('/linked-accounts'),
  linkPsn: (tag) => request('/linked-accounts/psn', { method: 'PUT', body: { tag } }),
  startOAuthLink: (platform) => request(`/linked-accounts/oauth/${encodeURIComponent(platform)}/start`),
  unlinkAccount: (platform) => request(`/linked-accounts/${encodeURIComponent(platform)}`, { method: 'DELETE' }),
};

export async function uploadClipFile(file) {
  const { uploadUrl, publicUrl } = await api.getUploadUrl(file.name, file.type);
  const res = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
  if (!res.ok) throw new Error('Upload failed — check the storage bucket CORS settings');
  return publicUrl;
}

export function saveSession(token, user) {
  localStorage.setItem('gc_token', token);
  localStorage.setItem('gc_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('gc_token');
  localStorage.removeItem('gc_user');
}

export function getSessionUser() {
  const raw = localStorage.getItem('gc_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { localStorage.removeItem('gc_user'); return null; }
}
