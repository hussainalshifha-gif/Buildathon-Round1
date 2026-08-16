import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { studentId, title, provider, completionDate, certificateUrl } = await req.json();

    if (!studentId || !title || !provider) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('certifications')
      .insert({
        student_id: studentId,
        title,
        provider,
        completion_date: completionDate || null,
        certificate_url: certificateUrl || null,
      })
      .select();

    if (error) {
      console.error('Add certification error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, certification: data[0] });
  } catch (err) {
    console.error('Add certification exception:', err);
    return Response.json({ error: 'Failed to add certification' }, { status: 500 });
  }
}
