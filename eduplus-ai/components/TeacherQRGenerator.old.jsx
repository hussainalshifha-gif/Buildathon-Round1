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
      const res = await fetch(`/api/attendance/live/${session.sessionId}`);
      const data = await res.json();
      setLiveCount(data.count);
      setScannedStudents(data.students);
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
    <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h2>QR Attendance</h2>

      {!session && (
        <div>
          <input
            placeholder="Class ID e.g. CSE-3B-DSA"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            style={{ padding: 8, width: '80%', marginBottom: 12 }}
          />
          <br />
          <button onClick={startSession} style={{ padding: '8px 16px' }}>
            Start Attendance
          </button>
        </div>
      )}

      {session && (
        <div>
          <p><strong>{classId}</strong> — live session</p>
          <img
            src={session.qrImage}
            alt="Attendance QR"
            style={{ width: 260, height: 260, border: '1px solid #ddd' }}
          />
          <p style={{ color: '#666', fontSize: 13 }}>QR refreshes automatically every 45s</p>
          <h3>{liveCount} student(s) marked present</h3>
          <ul style={{ textAlign: 'left', maxHeight: 150, overflowY: 'auto' }}>
            {scannedStudents.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
          <button onClick={endSession} style={{ padding: '8px 16px', background: '#e63946', color: '#fff' }}>
            End Attendance
          </button>
        </div>
      )}
    </div>
  );
}
