import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { studentId, assignmentId, content } = await req.json();

    if (!studentId || !assignmentId || !content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('submissions')
      .insert({ student_id: studentId, assignment_id: assignmentId, content })
      .select();

    if (error) {
      console.error('Submission error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, submission: data[0] });
  } catch (err) {
    console.error('Submission exception:', err);
    return Response.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
