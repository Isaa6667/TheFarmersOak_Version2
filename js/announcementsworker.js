// Cloudflare Worker: fetches the group's announcements server-side (Roblox blocks
// direct browser requests from other sites via CORS) and returns them with CORS
// headers for thefarmersoak.co.uk. Follows nextPageCursor so ALL are returned.
const GROUP_ID = 972666931;
// Confirm this URL in your browser's Network tab on the Roblox group's
// Announcements page (look for the request returning your JSON) and paste it here.
const UPSTREAM = `https://apis.roblox.com/community-announcements/v1/groups/${GROUP_ID}/announcements`;
const ALLOWED = ['https://thefarmersoak.co.uk', 'https://www.thefarmersoak.co.uk'];

export default {
  async fetch(req) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'application/json',
    };
    try {
      let all = [], cursor = null;
      for (let i = 0; i < 20; i++) {
        const url = UPSTREAM + (cursor ? `?cursor=${encodeURIComponent(cursor)}` : '');
        const r = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error('upstream ' + r.status);
        const j = await r.json();
        all = all.concat(j.data || []);
        cursor = j.nextPageCursor;
        if (!cursor) break;
      }
      return new Response(JSON.stringify({ data: all }), { headers: cors });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), { status: 502, headers: cors });
    }
  },
};
