'use client';

import { usePathname } from 'next/navigation';

const links = [
  { href: '/teacher/attendance', label: 'Attendance', group: 'Teacher' },
  { href: '/teacher/contests', label: 'Contests', group: 'Teacher' },
  { href: '/teacher/leaderboard', label: 'Leaderboard', group: 'Teacher' },
  { href: '/teacher/plagiarism', label: 'Plagiarism Check', group: 'Teacher' },
  { href: '/student/scan', label: 'Scan Attendance', group: 'Student' },
  { href: '/student/certifications', label: 'Certifications', group: 'Student' },
  { href: '/student/github', label: 'GitHub', group: 'Student' },
  { href: '/student/tracksheet', label: 'Tracksheet', group: 'Student' },
  { href: '/student/linkedin', label: 'LinkedIn', group: 'Student' },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: '#1a1a2e', padding: '14px 24px', display: 'flex',
      alignItems: 'center', gap: 24, flexWrap: 'wrap', colorScheme: 'light',
      position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    }}>
      <span style={{ color: '#fff', fontWeight: 800, fontSize: 16, letterSpacing: 0.3, marginRight: 8 }}>
        EduPlus AI
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              style={{
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                padding: '7px 12px',
                borderRadius: 8,
                color: active ? '#1a1a2e' : '#d8d8f0',
                background: active ? '#ffffff' : 'transparent',
                transition: 'background 0.15s',
              }}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
