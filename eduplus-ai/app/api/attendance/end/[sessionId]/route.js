import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request, { params }) {
  try {
    const { sessionId } = params;

    const { error } = await supabaseAdmin
      .from('attendance_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}
