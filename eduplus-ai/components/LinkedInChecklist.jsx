'use client';

import { useState, useEffect } from 'react';

const page = { background: '#eef0fa', minHeight: '100vh', padding: '40px 20px', colorScheme: 'light' };
const card = {
  maxWidth: 560, margin: '0 auto', background: '#ffffff', borderRadius: 18,
  padding: 32, boxShadow: '0 8px 30px rgba(30,20,80,0.10)', border: '1px solid #ececf5',
};
const input = {
  width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #dcdce8',
  fontSize: 14, outline: 'none', color: '#1a1a2e', background: '#ffffff',
  boxSizing: 'border-box', colorScheme: 'light',
};
const button = {
  marginTop: 22, padding: '13px', borderRadius: 10, border: 'none', color: '#ffffff',
  fontWeight: 700, fontSize: 14, cursor: 'pointer', width: '100%',
  background: 'linear-gradient(135deg, #6a5af9, #a06bfa)', boxShadow: '0 4px 14px rgba(106,90,249,0.35)',
};

export default function LinkedInChecklist({ studentId }) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasSummary, setHasSummary] = useState(false);
  const [hasExperience, setHasExperience] = useState(false);
  const [hasSkills, setHasSkills] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch(`/api/linkedin/get/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.checklist) {
          setHasPhoto(data.checklist.has_photo);
          setHasSummary(data.checklist.has_summary);
          setHasExperience(data.checklist.has_experience);
          setHasSkills(data.checklist.has_skills);
          setProfileUrl(data.checklist.profile_url || '');
        }
      });
  }, [studentId]);

  const completeness = Math.round(
    ([hasPhoto, hasSummary, hasExperience, hasSkills].filter(Boolean).length / 4) * 100
  );

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      const res = await fetch('/api/linkedin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, hasPhoto, hasSummary, hasExperience, hasSkills, profileUrl }),
      });
      const data = await res.json();
      setStatus(data.success ? 'Saved!' : 'Error: ' + data.error);
    } catch (err) {
      setStatus('Failed to save.');
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={{ color: '#1a1a2e', marginBottom: 2, fontSize: 22 }}>LinkedIn Profile Tracker</h2>
        <p style={{ color: '#6a6a85', marginBottom: 20, fontSize: 14 }}>
          Profile completeness: <strong style={{ color: '#6a5af9' }}>{completeness}%</strong>
        </p>

        <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a68', marginBottom: 4, display: 'block' }}>
          LinkedIn profile URL
        </label>
        <input placeholder="https://linkedin.com/in/yourname" value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)} style={{ ...input, marginBottom: 18 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Checkbox label="Profile photo added" checked={hasPhoto} onChange={setHasPhoto} />
          <Checkbox label="Summary / About section filled" checked={hasSummary} onChange={setHasSummary} />
          <Checkbox label="Experience section filled" checked={hasExperience} onChange={setHasExperience} />
          <Checkbox label="Skills listed" checked={hasSkills} onChange={setHasSkills} />
        </div>

        <button onClick={handleSave} style={button}>Save</button>

        {status && <p style={{ marginTop: 12, color: '#4a4a68', fontSize: 13 }}>{status}</p>}
      </div>
    </div>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#1a1a2e',
      padding: '10px 14px', background: '#f7f7fc', borderRadius: 10, border: '1px solid #ececf5',
      cursor: 'pointer',
    }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: '#6a5af9' }} />
      {label}
    </label>
  );
}
