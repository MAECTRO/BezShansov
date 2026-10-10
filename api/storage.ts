// api/storage.ts
// Умный адаптер для Upstash / Vercel KV / Redis через REST API

const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

export async function setTicketAuthor(ticketId: string, authorChatId: string | number): Promise<boolean> {
  if (!url || !token) {
    console.warn('[Storage] Missing KV/Upstash environment variables');
    return false;
  }

  try {
    const res = await fetch(`${url}/set/ticket_author_${encodeURIComponent(ticketId)}/${encodeURIComponent(String(authorChatId))}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.result === 'OK';
  } catch (e) {
    console.error('[Storage] Error setting author:', e);
    return false;
  }
}

export async function getTicketAuthor(ticketId: string): Promise<string | number | null> {
  if (!url || !token) {
    console.warn('[Storage] Missing KV/Upstash environment variables');
    return null;
  }

  try {
    const res = await fetch(`${url}/get/ticket_author_${encodeURIComponent(ticketId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data?.result ?? null;
  } catch (e) {
    console.error('[Storage] Error getting author:', e);
    return null;
  }
}
