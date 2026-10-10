import { kv } from '@vercel/kv';

const BOT_TOKEN = process.env.BOT_TOKEN || '8628252821:AAHeyGTQ9sH2B4bUPXgxlN-xbGV8f_6g9Zc';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(200).send('OK');
  
  try {
    const update = req.body;
    if (update?.message?.text && update.message.text.startsWith('/start ticket_')) {
      const ticketId = update.message.text.replace('/start ticket_', '').trim();
      const chatId = update.message.chat.id;
      
      if (ticketId && chatId) {
        await kv.set(`ticket_author_${ticketId}`, chatId);
        await sendMessage(chatId, 'Отлично! Я напишу сюда в личку, как только твою ссылку откроют и подпишут 💌');
      }
    }
    return res.status(200).send('OK');
  } catch (err) {
    console.error(err);
    return res.status(200).send('Error');
  }
}

async function sendMessage(chatId: string | number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
