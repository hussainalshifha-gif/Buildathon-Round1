import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req, { params }) {
  try {
    const { studentId } = await params;


    const { data, error } = await supabaseAdmin
      .from('certifications')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('List certifications error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const score = Math.min(data.length * 10, 100);

    return Response.json({ certifications: data, skillReadinessScore: score });
  } catch (err) {
    console.error('List certifications exception:', err);
    return Response.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}
