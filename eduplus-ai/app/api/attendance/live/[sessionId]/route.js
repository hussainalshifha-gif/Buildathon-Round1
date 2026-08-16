import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request, { params }) {
  try {
    const { sessionId } = params;

    const { data: records, error } = await supabaseAdmin
      .from('attendance_records')
      .select('student_id, marked_at')
      .eq('session_id', sessionId)
      .order('marked_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      count: records.length,
      students: records.map((r) => r.student_id),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch live attendance' }, { status: 500 });
  }
}
