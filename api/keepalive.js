// Vercel Cron Job — pings Supabase to prevent free-tier auto-pause.
// Runs every 4 days via vercel.json cron config.

export default async function handler(req, res) {
  const url = "https://gelsxcbyokdizeuklkyj.supabase.co/functions/v1/get-report";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: "keepalive" }),
    });
    const status = response.status;
    res.status(200).json({ ok: true, supabase_status: status, ts: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message, ts: new Date().toISOString() });
  }
}
