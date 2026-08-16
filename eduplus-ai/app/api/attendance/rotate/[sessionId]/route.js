import { NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request, { params }) {
  try {
    const { sessionId } = params;
    const newToken = crypto.randomBytes(16).toString('hex');

    const { data: session, error } = await supabaseAdmin
      .from('attendance_sessions')
      .update({ token: newToken })
      .eq('id', sessionId)
      .eq('is_active', true)
      .select()
      .single();

    if (error || !session) {
      return NextResponse.json({ error: 'Session not found or ended' }, { status: 404 });
    }

    const qrPayload = JSON.stringify({ sessionId: session.id, token: session.token });
    const qrImage = await QRCode.toDataURL(qrPayload);

    return NextResponse.json({ token: session.token, qrImage });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to rotate token' }, { status: 500 });
  }
}
