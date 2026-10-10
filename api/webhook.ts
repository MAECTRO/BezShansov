const BOT_TOKEN = process.env.BOT_TOKEN || '8628252821:AAHeyGTQ9sH2B4bUPXgxlN-xbGV8f_6g9Zc';

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

async function setTicketAuthor(ticketId: string, authorChatId: string | number): Promise<boolean> {
  if (!KV_URL || !KV_TOKEN) {
    console.warn('[Storage] Missing KV/Upstash environment variables');
    return false;
  }

  try {
    const res = await fetch(`${KV_URL}/set/ticket_author_${encodeURIComponent(ticketId)}/${encodeURIComponent(String(authorChatId))}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
      },
    });
    const data: any = await res.json();
    return data?.result === 'OK';
  } catch (e) {
    console.error('[Storage] Error setting author:', e);
    return false;
  }
}

async function sendMessage(chatId: string | number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(200).send('OK');
  
  try {
    const update = req.body;
    if (update?.message?.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;

      if (text.startsWith('/start ticket_')) {
        const ticketId = text.replace('/start ticket_', '').trim();
        if (ticketId && chatId) {
          await setTicketAuthor(ticketId, chatId);
          await sendMessage(chatId, 'Отлично! Я напишу сюда в личку, как только твою ссылку откроют и подпишут 💌');
        }
      } else if (text === '/start') {
        await sendMessage(chatId, 'Привет! Я бот сервиса «БезШансов» 💌\n\nСоздавай интерактивные свидания на сайте и нажимай «Уведомить в Telegram» — я пришлю тебе сообщение, как только билет подпишут!');
      }
    }
    return res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    return res.status(200).send('Error');
  }
}
