import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { studentId, taskName, status } = await req.json();

    if (!studentId || !taskName) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('tracksheet_entries')
      .insert({
        student_id: studentId,
        task_name: taskName,
        status: status || 'pending',
      })
      .select();

    if (error) {
      console.error('Add tracksheet entry error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, entry: data[0] });
  } catch (err) {
    console.error('Add tracksheet exception:', err);
    return Response.json({ error: 'Failed to add entry' }, { status: 500 });
  }
}
