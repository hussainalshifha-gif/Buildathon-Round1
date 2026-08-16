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

export default function PlagiarismPanel() {
  const [assignmentId, setAssignmentId] = useState('');
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!assignmentId.trim()) { setStatus('Enter an assignment ID.'); return; }
    setStatus('Checking...');
    try {
      const res = await fetch('/api/plagiarism/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId }),
      });
      const data = await res.json();
      if (data.flagged !== undefined) { setResult(data); setStatus(''); }
      else { setStatus('Error: ' + data.error); }
    } catch (err) {
      setStatus('Failed to check.');
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ color: '#1a1a2e', marginBottom: 18, fontSize: 22 }}>Plagiarism Checker</h2>

        <form onSubmit={handleCheck} style={{ display: 'flex', gap: 10 }}>
          <input placeholder="Assignment ID" value={assignmentId}
            onChange={(e) => setAssignmentId(e.target.value)} style={input} />
          <button type="submit" style={button}>Check</button>
        </form>

        {status && <p style={{ marginTop: 12, color: '#4a4a68', fontSize: 13 }}>{status}</p>}

        {result && (
          <div style={{ marginTop: 22 }}>
            <p style={{ color: '#6a6a85', fontSize: 14 }}>
              {result.totalSubmissions} submissions checked. {result.flagged.length} flagged pair(s).
            </p>
            {result.flagged.map((f, i) => (
              <div key={i} style={{
                padding: '12px 16px', background: '#fff2df', borderRadius: 12, marginTop: 8,
                border: '1px solid #fde2b8',
              }}>
                <strong style={{ color: '#1a1a2e', fontSize: 14 }}>{f.studentA}</strong>
                <span style={{ color: '#6a6a85' }}> vs </span>
                <strong style={{ color: '#1a1a2e', fontSize: 14 }}>{f.studentB}</strong>
                <div style={{ fontSize: 13, color: '#a15c00', marginTop: 4, fontWeight: 600 }}>
                  {f.similarity}% similar
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
