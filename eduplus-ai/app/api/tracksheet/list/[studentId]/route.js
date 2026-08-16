import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(req, { params }) {
  try {
    const { studentId } = params;

    const { data, error } = await supabaseAdmin
      .from('tracksheet_entries')
      .select('*')
      .eq('student_id', studentId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('List tracksheet error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ entries: data });
  } catch (err) {
    console.error('List tracksheet exception:', err);
    return Response.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}
