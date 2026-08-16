import { NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const SESSION_LENGTH_MS = 15 * 60 * 1000; // whole window stays scannable for 15 min
const ROTATE_EVERY_MS = 45 * 1000;        // QR image itself rotates every 45s

export async function POST(request) {
  try {
    const { classId, teacherId } = await request.json();
    if (!classId || !teacherId) {
      return NextResponse.json({ error: 'classId and teacherId are required' }, { status: 400 });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_LENGTH_MS).toISOString();

    const { data: session, error } = await supabaseAdmin
      .from('attendance_sessions')
      .insert({ class_id: classId, teacher_id: teacherId, token, expires_at: expiresAt })
      .select()
      .single();

    if (error) throw error;

    const qrPayload = JSON.stringify({ sessionId: session.id, token: session.token });
    const qrImage = await QRCode.toDataURL(qrPayload);

    return NextResponse.json({
      sessionId: session.id,
      token: session.token,
      qrImage,
      rotateEveryMs: ROTATE_EVERY_MS,
      sessionEndsAt: session.expires_at,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to generate attendance session' }, { status: 500 });
  }
}
