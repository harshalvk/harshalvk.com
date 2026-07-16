export async function GET() {
  const res = await fetch(
    `https://api.vercel.com/v1/query/web-analytics/visits/count?teamId=${process.env.VERCEL_TEAM_ID}&projectId=${process.env.VERCEL_PROJECT_ID}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return Response.json({ data: null }, { status: 500 });

  const data = await res.json();
  return Response.json(data);
}
