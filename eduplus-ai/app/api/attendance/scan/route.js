import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request) {
  try {
    const { sessionId, token, studentId } = await request.json();
    if (!sessionId || !token || !studentId) {
      return NextResponse.json(
        { error: 'sessionId, token, and studentId are required' },
        { status: 400 }
      );
    }

    const { data: session, error: sessionError } = await supabaseAdmin
      .from('attendance_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session || !session.is_active) {
      return NextResponse.json({ error: 'This session has ended.' }, { status: 404 });
    }
    if (session.token !== token) {
      return NextResponse.json({ error: 'QR code expired, please rescan.' }, { status: 400 });
    }
    if (new Date() > new Date(session.expires_at)) {
      return NextResponse.json({ error: 'Attendance window has closed.' }, { status: 400 });
    }

    const { error: insertError } = await supabaseAdmin
      .from('attendance_records')
      .insert({ session_id: sessionId, class_id: session.class_id, student_id: studentId });

    if (insertError) {
      // Postgres unique_violation code
      if (insertError.code === '23505') {
        return NextResponse.json(
          { error: 'You have already been marked present.' },
          { status: 409 }
        );
      }
      throw insertError;
    }

    return NextResponse.json({ success: true, message: 'Attendance marked successfully' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 });
  }
}
