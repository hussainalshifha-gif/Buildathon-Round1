'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode'; // npm install html5-qrcode

export default function StudentQRScanner({ studentId }) {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [manualSessionId, setManualSessionId] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [useCameraMode, setUseCameraMode] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!useCameraMode) return;
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 });
    scannerRef.current = scanner;
    scanner.render(
      (decodedText) => {
        try {
          const { sessionId, token } = JSON.parse(decodedText);
          submitAttendance(sessionId, token);
        } catch {
          setStatus('error');
          setMessage('Could not read QR. Try manual entry below.');
        }
      },
      () => {}
    );
    return () => {
      scanner.clear().catch(() => {});
    };
  }, [useCameraMode]);

  const submitAttendance = async (sessionId, token) => {
    try {
      const res = await fetch('/api/attendance/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, token, studentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Check your connection and try again.');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualSessionId || !manualToken) return;
    submitAttendance(manualSessionId.trim(), manualToken.trim());
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>✅ Mark Attendance</h2>

      <div style={styles.card}>
        {status === 'success' && (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <p style={styles.successText}>{message}</p>
          </div>
        )}

        {status !== 'success' && (
          <>
            <form onSubmit={handleManualSubmit} style={styles.form}>
              <p style={styles.label}>Enter the code shown on your teacher's screen</p>
              <input
                placeholder="Session ID"
                value={manualSessionId}
                onChange={(e) => setManualSessionId(e.target.value)}
                style={styles.input}
              />
              <input
                placeholder="Token"
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.submitBtn}>Mark Present</button>
            </form>

            {status === 'error' && <p style={styles.errorText}>❌ {message}</p>}

            <div style={styles.divider}><span>or</span></div>

            {!useCameraMode ? (
              <button onClick={() => setUseCameraMode(true)} style={styles.cameraToggleBtn}>
                📷 Scan QR with camera instead
              </button>
            ) : (
              <div id="qr-reader" style={{ width: '100%', marginTop: 12 }} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 420, margin: '40px auto', textAlign: 'center', fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' },
  heading: { fontSize: 24, marginBottom: 20, fontWeight: 700 },
  card: { background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 8px 30px rgba(0,0,0,0.10)' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { fontSize: 13, color: '#6b7099', fontWeight: 600, marginBottom: 4 },
  input: { padding: '12px 14px', borderRadius: 10, border: '1px solid #dcdfef', fontSize: 14, boxSizing: 'border-box' },
  submitBtn: { padding: '13px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#5b6ee8,#7c5ce8)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  errorText: { color: '#e63946', fontSize: 13, marginTop: 12, fontWeight: 600 },
  divider: { margin: '20px 0', color: '#b0b3c7', fontSize: 12, fontWeight: 700, position: 'relative' },
  cameraToggleBtn: { width: '100%', padding: '11px 0', borderRadius: 10, border: '1px solid #dcdfef', background: '#f7f8fc', color: '#3b3fd6', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  successBox: { padding: '20px 0' },
  successIcon: { width: 60, height: 60, borderRadius: '50%', background: '#eefaf0', color: '#1e7d3c', fontSize: 28, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  successText: { fontSize: 15, fontWeight: 700, color: '#1e7d3c' },
};
