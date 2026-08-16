export async function GET() {
  try {
    const res = await fetch('https://codeforces.com/api/contest.list', {
      cache: 'no-store',
    });
    const data = await res.json();

    if (data.status !== 'OK') {
      return Response.json({ error: 'Codeforces API error' }, { status: 502 });
    }

    const upcoming = data.result
      .filter((c) => c.phase === 'BEFORE')
      .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
      .slice(0, 10)
      .map((c) => ({
        id: c.id,
        name: c.name,
        startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
        durationMinutes: Math.round(c.durationSeconds / 60),
      }));

    return Response.json({ contests: upcoming });
  } catch (err) {
    console.error('Contest fetch error:', err);
    return Response.json({ error: 'Failed to fetch contests' }, { status: 500 });
  }
}
