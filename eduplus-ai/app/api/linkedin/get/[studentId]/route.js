import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req, { params }) {
  try {
    const { studentId } = await params;

    const { data, error } = await supabaseAdmin
      .from('linkedin_checklist')
      .select('*')
      .eq('student_id', studentId)
      .maybeSingle();

    if (error) {
      console.error('LinkedIn get error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ checklist: data });
  } catch (err) {
    console.error('LinkedIn get exception:', err);
    return Response.json({ error: 'Failed to fetch checklist' }, { status: 500 });
  }
}
