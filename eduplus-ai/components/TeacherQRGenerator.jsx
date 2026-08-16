'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * Teacher-facing screen. Same behavior as before, just calling
 * relative /api routes since this lives inside the same Next.js app.
 */
export default function TeacherQRGenerator({ teacherId }) {
  const [classId, setClassId] = useState('');
  const [session, setSession] = useState(null);
  const [liveCount, setLiveCount] = useState(0);
  const [scannedStudents, setScannedStudents] = useState([]);
  const rotateInterval = useRef(null);
  const pollInterval = useRef(null);

  const startSession = async () => {
    if (!classId) return alert('Enter a class ID first (e.g. CSE-3B-DSA)');
    const res = await fetch('/api/attendance/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId, teacherId }),
    });
    const data = await res.json();
    setSession(data);
  };

  useEffect(() => {
    if (!session) return;
    rotateInterval.current = setInterval(async () => {
      const res = await fetch(`/api/attendance/rotate/${session.sessionId}`, { method: 'POST' });
      const data = await res.json();
      setSession((prev) => ({ ...prev, qrImage: data.qrImage, token: data.token }));
    }, session.rotateEveryMs || 45000);

    return () => clearInterval(rotateInterval.current);
  }, [session?.sessionId]);

  useEffect(() => {
    if (!session) return;
    pollInterval.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/attendance/live/${session.sessionId}`);
        const data = await res.json();
        if (!res.ok) {
          console.error('Live count error:', data.error);
          return; // keep showing last known good state instead of crashing
        }
        setLiveCount(data.count ?? 0);
        setScannedStudents(Array.isArray(data.students) ? data.students : []);
      } catch (err) {
        console.error('Live count fetch failed:', err);
      }
    }, 3000);

    return () => clearInterval(pollInterval.current);
  }, [session?.sessionId]);

  const endSession = async () => {
    await fetch(`/api/attendance/end/${session.sessionId}`, { method: 'POST' });
    clearInterval(rotateInterval.current);
    clearInterval(pollInterval.current);
    alert(`Attendance ended. ${liveCount} students marked present.`);
    setSession(null);
    setLiveCount(0);
    setScannedStudents([]);
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📶 QR Attendance</h2>

      {!session && (
        <div style={styles.card}>
          <input
            placeholder="Class ID e.g. CSE-3B-DSA"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            style={styles.input}
          />
          <button onClick={startSession} style={styles.startBtn}>
            Start Attendance
          </button>
        </div>
      )}

      {session && (
        <div style={styles.card}>
          <p style={styles.className}>{classId}</p>
          <span style={styles.liveBadge}>● LIVE</span>
          <img src={session.qrImage} alt="Attendance QR" style={styles.qrImage} />
          <p style={styles.hint}>Refreshes automatically every 45s</p>

          <div style={styles.manualBox}>
            <p style={styles.manualLabel}>Can't scan? Share this code manually:</p>
            <div style={styles.codeRow}>
              <code style={styles.codeText}>{session.sessionId}</code>
              <code style={styles.codeText}>{session.token}</code>
            </div>
          </div>

          <h3 style={styles.countText}>{liveCount} student(s) marked present</h3>
          <ul style={styles.studentList}>
            {scannedStudents.map((id) => (
              <li key={id} style={styles.studentItem}>✓ {id}</li>
            ))}
          </ul>
          <button onClick={endSession} style={styles.endBtn}>End Attendance</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 440,
    margin: '40px auto',
    textAlign: 'center',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    color: '#1a1a2e',
  },
  heading: { fontSize: 26, marginBottom: 20, fontWeight: 700 },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '28px 24px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
    position: 'relative',
  },
  className: { fontSize: 20, fontWeight: 700, margin: '0 0 4px' },
  liveBadge: {
    display: 'inline-block',
    background: '#ff4d6d',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 20,
    letterSpacing: 1,
    marginBottom: 16,
  },
  qrImage: {
    width: 240,
    height: 240,
    borderRadius: 16,
    border: '6px solid #f0f2ff',
    display: 'block',
    margin: '0 auto',
  },
  hint: { color: '#8a8fa3', fontSize: 13, marginTop: 10, marginBottom: 18 },
  manualBox: {
    background: '#f7f8fc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    textAlign: 'left',
  },
  manualLabel: { fontSize: 12, color: '#6b7099', marginBottom: 6, fontWeight: 600 },
  codeRow: { display: 'flex', flexDirection: 'column', gap: 4 },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    background: '#fff',
    padding: '6px 10px',
    borderRadius: 8,
    border: '1px solid #e4e6f2',
    wordBreak: 'break-all',
  },
  countText: { fontSize: 18, margin: '4px 0 10px', fontWeight: 700, color: '#3b3fd6' },
  studentList: {
    textAlign: 'left',
    maxHeight: 140,
    overflowY: 'auto',
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px',
  },
  studentItem: {
    padding: '6px 10px',
    background: '#eefaf0',
    color: '#1e7d3c',
    borderRadius: 8,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #dcdfef',
    fontSize: 15,
    marginBottom: 16,
    boxSizing: 'border-box',
  },
  startBtn: {
    width: '100%',
    padding: '13px 0',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg,#5b6ee8,#7c5ce8)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  endBtn: {
    width: '100%',
    padding: '12px 0',
    borderRadius: 10,
    border: 'none',
    background: '#ff4d6d',
    color: '#fff',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
};
