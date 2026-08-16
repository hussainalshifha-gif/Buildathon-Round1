'use client';

import { useState } from 'react';

const page = { background: '#eef0fa', minHeight: '100vh', padding: '40px 20px', colorScheme: 'light' };
const card = {
  maxWidth: 560, margin: '0 auto', background: '#ffffff', borderRadius: 18,
  padding: 32, boxShadow: '0 8px 30px rgba(30,20,80,0.10)', border: '1px solid #ececf5',
};
const input = {
  flex: 1, padding: '11px 14px', borderRadius: 10, border: '1.5px solid #dcdce8',
  fontSize: 14, outline: 'none', color: '#1a1a2e', background: '#ffffff', colorScheme: 'light',
};
const button = {
  padding: '11px 20px', borderRadius: 10, border: 'none', color: '#ffffff', fontWeight: 700,
  fontSize: 14, cursor: 'pointer', background: 'linear-gradient(135deg, #6a5af9, #a06bfa)',
  boxShadow: '0 4px 14px rgba(106,90,249,0.35)',
};

export default function GitHubTracker({ studentId }) {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('');

  const handleSync = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setStatus('Enter a GitHub username.'); return; }
    setStatus('Syncing...');
    try {
      const res = await fetch('/api/github/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, username }),
      });
      const data = await res.json();
      if (data.success) { setProfile(data.profile); setStatus('Synced!'); }
      else { setStatus('Error: ' + data.error); }
    } catch (err) {
      setStatus('Failed to sync.');
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ color: '#1a1a2e', marginBottom: 18, fontSize: 22 }}>GitHub Integration</h2>

        <form onSubmit={handleSync} style={{ display: 'flex', gap: 10 }}>
          <input placeholder="GitHub username" value={username}
            onChange={(e) => setUsername(e.target.value)} style={input} />
          <button type="submit" style={button}>Sync</button>
        </form>

        {status && <p style={{ marginTop: 12, color: '#4a4a68', fontSize: 13 }}>{status}</p>}

        {profile && (
          <div style={{ marginTop: 22, padding: '16px', background: '#f7f7fc', borderRadius: 12, border: '1px solid #ececf5' }}>
            <p style={{ color: '#1a1a2e', fontSize: 15, fontWeight: 700, margin: 0 }}>@{profile.github_username}</p>
            <p style={{ color: '#6a6a85', fontSize: 14, margin: '6px 0 0' }}>Public repos: {profile.public_repos}</p>
            <p style={{ color: '#6a6a85', fontSize: 14, margin: '2px 0 0' }}>Followers: {profile.followers}</p>
          </div>
        )}
      </div>
    </div>
  );
}
