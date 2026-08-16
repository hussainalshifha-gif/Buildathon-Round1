'use client';

import { useState, useEffect } from 'react';

const page = { background: '#eef0fa', minHeight: '100vh', padding: '40px 20px', colorScheme: 'light' };
const card = {
  maxWidth: 620, margin: '0 auto', background: '#ffffff', borderRadius: 18,
  padding: 32, boxShadow: '0 8px 30px rgba(30,20,80,0.10)', border: '1px solid #ececf5',
};

function timeUntil(startTime) {
  const diffMs = new Date(startTime) - new Date();
  if (diffMs < 0) return 'Started';
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  if (days > 0) return `in ${days}d ${hours}h`;
  return `in ${hours}h`;
}

export default function ContestList() {
  const [contests, setContests] = useState([]);
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/api/contests/upcoming')
      .then((res) => res.json())
      .then((data) => {
        if (data.contests) { setContests(data.contests); setStatus(''); }
        else { setStatus('Could not load contests.'); }
      })
      .catch(() => setStatus('Could not load contests.'));
  }, []);

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>🏆</span>
          <h2 style={{ color: '#1a1a2e', fontSize: 22, margin: 0 }}>Upcoming Coding Contests</h2>
        </div>
        <p style={{ color: '#9a9ab0', fontSize: 13, marginBottom: 22 }}>
          Live from Codeforces — stay ready for the next round.
        </p>

        {status && <p style={{ color: '#9a9ab0', fontSize: 14 }}>{status}</p>}
        {!status && contests.length === 0 && (
          <p style={{ color: '#9a9ab0', fontSize: 14 }}>No upcoming contests found right now.</p>
        )}

        {contests.map((c, i) => (
          <div key={c.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 18px', background: i === 0 ? '#f0edff' : '#f7f7fc',
            borderRadius: 14, marginBottom: 10,
            border: i === 0 ? '1.5px solid #c9bdfa' : '1px solid #ececf5',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i === 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 800, color: '#fff', background: '#6a5af9',
                    padding: '2px 8px', borderRadius: 999, letterSpacing: 0.4,
                  }}>NEXT UP</span>
                )}
                <strong style={{ color: '#1a1a2e', fontSize: 15 }}>{c.name}</strong>
              </div>
              <div style={{ fontSize: 13, color: '#6a6a85', marginTop: 5 }}>
                📅 {new Date(c.startTime).toLocaleString()} &nbsp;·&nbsp; ⏱ {c.durationMinutes} min
              </div>
            </div>
            <div style={{
              fontSize: 12, fontWeight: 700, color: '#6a5af9', background: '#fff',
              padding: '6px 12px', borderRadius: 10, border: '1px solid #dcd4fb', whiteSpace: 'nowrap',
            }}>
              {timeUntil(c.startTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
