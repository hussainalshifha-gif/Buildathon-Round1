'use client';

import { useState, useEffect } from 'react';

const page = { background: '#eef0fa', minHeight: '100vh', padding: '40px 20px', colorScheme: 'light' };
const card = {
  maxWidth: 560, margin: '0 auto', background: '#ffffff', borderRadius: 18,
  padding: 32, boxShadow: '0 8px 30px rgba(30,20,80,0.10)', border: '1px solid #ececf5',
};
const label = { fontSize: 13, fontWeight: 600, color: '#4a4a68', marginBottom: 4, display: 'block' };
const input = {
  width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #dcdce8',
  fontSize: 14, outline: 'none', color: '#1a1a2e', background: '#ffffff',
  boxSizing: 'border-box', colorScheme: 'light',
};
const button = {
  padding: '13px', borderRadius: 10, border: 'none', color: '#ffffff', fontWeight: 700,
  fontSize: 14, cursor: 'pointer', background: 'linear-gradient(135deg, #6a5af9, #a06bfa)',
  boxShadow: '0 4px 14px rgba(106,90,249,0.35)', width: '100%', marginTop: 4,
};

export default function CertificationTracker({ studentId }) {
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('NPTEL');
  const [completionDate, setCompletionDate] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [certifications, setCertifications] = useState([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('');

  const loadCertifications = async () => {
    try {
      const res = await fetch(`/api/certifications/list/${studentId}`);
      const data = await res.json();
      if (data.certifications) {
        setCertifications(data.certifications);
        setScore(data.skillReadinessScore);
      }
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  useEffect(() => { loadCertifications(); }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setStatus('Please enter a certification title.'); return; }
    setStatus('Saving...');
    try {
      const res = await fetch('/api/certifications/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, title, provider, completionDate, certificateUrl }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus('Certification added!');
        setTitle(''); setCertificateUrl('');
        loadCertifications();
      } else {
        setStatus('Error: ' + data.error);
      }
    } catch (err) {
      setStatus('Failed to save certification.');
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ color: '#1a1a2e', marginBottom: 2, fontSize: 22 }}>Certification Tracker</h2>
        <p style={{ color: '#6a6a85', marginBottom: 22, fontSize: 14 }}>
          Skill Readiness Score: <strong style={{ color: '#6a5af9' }}>{score}/100</strong>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={label}>Certification title</label>
            <input placeholder="e.g. Data Structures & Algorithms" value={title}
              onChange={(e) => setTitle(e.target.value)} style={input} />
          </div>
          <div>
            <label style={label}>Provider</label>
            <select value={provider} onChange={(e) => setProvider(e.target.value)} style={input}>
              <option style={{ color: '#1a1a2e' }}>NPTEL</option>
              <option style={{ color: '#1a1a2e' }}>Coursera</option>
              <option style={{ color: '#1a1a2e' }}>Udemy</option>
              <option style={{ color: '#1a1a2e' }}>Other</option>
            </select>
          </div>
          <div>
            <label style={label}>Completion date</label>
            <input type="date" value={completionDate} onChange={(e) => setCompletionDate(e.target.value)} style={input} />
          </div>
          <div>
            <label style={label}>Certificate URL (optional)</label>
            <input placeholder="https://..." value={certificateUrl} onChange={(e) => setCertificateUrl(e.target.value)} style={input} />
          </div>
          <button type="submit" style={button}>Add Certification</button>
        </form>

        {status && <p style={{ marginTop: 12, color: '#4a4a68', fontSize: 13 }}>{status}</p>}

        <div style={{ marginTop: 28 }}>
          <h3 style={{ color: '#1a1a2e', fontSize: 15, marginBottom: 12, fontWeight: 700 }}>Your Certifications</h3>
          {certifications.length === 0 && <p style={{ color: '#9a9ab0', fontSize: 14 }}>None added yet.</p>}
          {certifications.map((c) => (
            <div key={c.id} style={{
              padding: '12px 16px', background: '#f7f7fc', borderRadius: 12, marginBottom: 8,
              border: '1px solid #ececf5',
            }}>
              <strong style={{ color: '#1a1a2e', fontSize: 14 }}>{c.title}</strong>
              <div style={{ fontSize: 13, color: '#6a6a85', marginTop: 2 }}>
                {c.provider} {c.completion_date ? `· ${c.completion_date}` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
