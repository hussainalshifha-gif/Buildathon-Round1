import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('github_profiles')
      .select('*');

    if (error) {
      console.error('Leaderboard error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const ranked = data
      .map((p) => ({
        studentId: p.student_id,
        githubUsername: p.github_username,
        publicRepos: p.public_repos,
        followers: p.followers,
        score: (p.public_repos || 0) * 2 + (p.followers || 0) * 1,
      }))
      .sort((a, b) => b.score - a.score);

    return Response.json({ leaderboard: ranked });
  } catch (err) {
    console.error('Leaderboard exception:', err);
    return Response.json({ error: 'Failed to compute leaderboard' }, { status: 500 });
  }
}
