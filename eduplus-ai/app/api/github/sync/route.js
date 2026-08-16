import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req) {
  try {
    const { studentId, username } = await req.json();

    if (!studentId || !username) {
      return Response.json({ error: 'Missing studentId or username' }, { status: 400 });
    }

    const ghRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github+json' },
    });

    if (!ghRes.ok) {
      return Response.json({ error: 'GitHub user not found' }, { status: 404 });
    }

    const ghData = await ghRes.json();

    const { data, error } = await supabaseAdmin
      .from('github_profiles')
      .upsert({
        student_id: studentId,
        github_username: username,
        public_repos: ghData.public_repos,
        followers: ghData.followers,
        last_synced: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('GitHub sync DB error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, profile: data[0] });
  } catch (err) {
    console.error('GitHub sync exception:', err);
    return Response.json({ error: 'Failed to sync GitHub profile' }, { status: 500 });
  }
}
