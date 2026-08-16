'use client';

import { useState, useEffect } from 'react';

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

export default function TracksheetTracker({ studentId }) {
  const [taskName, setTaskName] = useState('');
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState('');

  const loadEntries = async () => {
    try {
      const res = await fetch(`/api/tracksheet/list/${studentId}`);
      const data = await res.json();
      if (data.entries) setEntries(data.entries);
    } catch (err) { console.error('Load error:', err); }
  };

  useEffect(() => { loadEntries(); }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName.trim()) { setStatus('Enter a task name.'); return; }
    setStatus('Saving...');
    try {
      const res = await fetch('/api/tracksheet/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, taskName, status: 'pending' }),
      });
      const data = await res.json();
      if (data.success) { setStatus('Task added!'); setTaskName(''); loadEntries(); }
      else { setStatus('Error: ' + data.error); }
    } catch (err) {
      setStatus('Failed to save.');
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ color: '#1a1a2e', marginBottom: 18, fontSize: 22 }}>Tracksheet</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10 }}>
          <input placeholder="Task name" value={taskName}
            onChange={(e) => setTaskName(e.target.value)} style={input} />
          <button type="submit" style={button}>Add</button>
        </form>

        {status && <p style={{ marginTop: 12, color: '#4a4a68', fontSize: 13 }}>{status}</p>}

        <div style={{ marginTop: 22 }}>
          {entries.map((e) => (
            <div key={e.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', background: '#f7f7fc', borderRadius: 12, marginBottom: 8,
              border: '1px solid #ececf5',
            }}>
              <span style={{ color: '#1a1a2e', fontSize: 14 }}>{e.task_name}</span>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                color: e.status === 'done' ? '#1e7d34' : '#a15c00',
                background: e.status === 'done' ? '#e3f6e8' : '#fff2df',
              }}>{e.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
