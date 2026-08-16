import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { studentId, hasPhoto, hasSummary, hasExperience, hasSkills, profileUrl } = await req.json();

    if (!studentId) {
      return Response.json({ error: 'Missing studentId' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('linkedin_checklist')
      .upsert({
        student_id: studentId,
        has_photo: !!hasPhoto,
        has_summary: !!hasSummary,
        has_experience: !!hasExperience,
        has_skills: !!hasSkills,
        profile_url: profileUrl || null,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('LinkedIn save error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, checklist: data[0] });
  } catch (err) {
    console.error('LinkedIn save exception:', err);
    return Response.json({ error: 'Failed to save checklist' }, { status: 500 });
  }
}
