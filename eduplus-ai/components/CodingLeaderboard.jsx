'use client';

import { useState, useEffect } from 'react';

const page = { background: '#eef0fa', minHeight: '100vh', padding: '40px 20px', colorScheme: 'light' };
const card = {
  maxWidth: 620, margin: '0 auto', background: '#ffffff', borderRadius: 18,
  padding: 32, boxShadow: '0 8px 30px rgba(30,20,80,0.10)', border: '1px solid #ececf5',
};

const medals = ['🥇', '🥈', '🥉'];

export default function CodingLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) { setLeaderboard(data.leaderboard); setStatus(''); }
        else { setStatus('Could not load leaderboard.'); }
      })
      .catch(() => setStatus('Could not load leaderboard.'));
  }, []);

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>📊</span>
          <h2 style={{ color: '#1a1a2e', fontSize: 22, margin: 0 }}>Coding Leaderboard</h2>
        </div>
        <p style={{ color: '#9a9ab0', fontSize: 13, marginBottom: 22 }}>
          Ranked by GitHub activity — 2 points per public repo, 1 per follower.
        </p>

        {status && <p style={{ color: '#9a9ab0', fontSize: 14 }}>{status}</p>}

        {!status && leaderboard.length === 0 && (
          <div style={{
            padding: '24px', background: '#f7f7fc', borderRadius: 14, textAlign: 'center',
            border: '1px dashed #dcdce8',
          }}>
            <p style={{ color: '#6a6a85', fontSize: 14, margin: 0 }}>
              No students on the board yet.
            </p>
            <p style={{ color: '#9a9ab0', fontSize: 13, marginTop: 6 }}>
              Sync a GitHub profile on the <strong>GitHub</strong> page to appear here.
            </p>
          </div>
        )}

        {leaderboard.map((entry, i) => (
          <div key={entry.studentId} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 18px', background: i < 3 ? '#f0edff' : '#f7f7fc',
            borderRadius: 14, marginBottom: 10,
            border: i < 3 ? '1.5px solid #c9bdfa' : '1px solid #ececf5',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>
                {medals[i] || `#${i + 1}`}
              </span>
              <div>
                <div style={{ color: '#1a1a2e', fontSize: 14, fontWeight: 700 }}>
                  {entry.githubUsername || entry.studentId}
                </div>
                <div style={{ color: '#9a9ab0', fontSize: 12, marginTop: 2 }}>
                  {entry.publicRepos} repos · {entry.followers} followers
                </div>
              </div>
            </div>
            <span style={{
              fontWeight: 800, color: '#6a5af9', fontSize: 15, background: '#fff',
              padding: '6px 14px', borderRadius: 10, border: '1px solid #dcd4fb',
            }}>
              {entry.score} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
