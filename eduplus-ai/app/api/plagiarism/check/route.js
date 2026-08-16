import { supabaseAdmin } from '@/lib/supabaseAdmin';

function jaccardSimilarity(a, b) {
  const setA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const setB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  if (union === 0) return 0;
  return intersection / union;
}

export async function POST(req) {
  try {
    const { assignmentId } = await req.json();

    if (!assignmentId) {
      return Response.json({ error: 'Missing assignmentId' }, { status: 400 });
    }

    const { data: submissions, error } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .eq('assignment_id', assignmentId);

    if (error) {
      console.error('Plagiarism fetch error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const flagged = [];
    for (let i = 0; i < submissions.length; i++) {
      for (let j = i + 1; j < submissions.length; j++) {
        const similarity = jaccardSimilarity(submissions[i].content, submissions[j].content);
        if (similarity > 0.6) {
          flagged.push({
            studentA: submissions[i].student_id,
            studentB: submissions[j].student_id,
            similarity: Math.round(similarity * 100),
          });
        }
      }
    }

    return Response.json({ totalSubmissions: submissions.length, flagged });
  } catch (err) {
    console.error('Plagiarism check exception:', err);
    return Response.json({ error: 'Failed to check plagiarism' }, { status: 500 });
  }
}
