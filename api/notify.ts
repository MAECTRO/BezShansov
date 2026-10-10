import { getTicketAuthor } from './storage';

const BOT_TOKEN = process.env.BOT_TOKEN || '8628252821:AAHeyGTQ9sH2B4bUPXgxlN-xbGV8f_6g9Zc';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '8010010144';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(200).send('OK');
  
  try {
    const { type, payload } = req.body;

    if (type === 'TICKET_CREATED') {
      const time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
      const text = `🎟️ Создан новый билет на сайте!\n🕒 Время: ${time}`;
      await sendMessage(ADMIN_CHAT_ID, text);
    } 
    else if (type === 'TICKET_SIGNED') {
      const time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
      const adminText = `✍️ Билет успешно подписан пользователем!\n🕒 Время: ${time}`;
      await sendMessage(ADMIN_CHAT_ID, adminText);

      // Уведомление автору
      const { ticketId, guestName, date, time: evtTime, location, food, drinks, conditions } = payload || {};
      if (ticketId) {
        try {
          const authorChatId = await getTicketAuthor(ticketId);
          if (authorChatId) {
            const authorText = `🎉 Твой билет подписан!\n\n👤 Гость: ${guestName || 'Не указан'}\n📅 Когда: ${date || 'Не указано'} в ${evtTime || 'Не указано'}\n📍 Локация: ${location || 'Не указана'}\n🍕 Еда: ${food || 'Не указана'}\n🥤 Напитки: ${drinks || 'Не указано'}\n📜 Условия: ${conditions || 'Не указаны'}\n\n✍️ Личная подпись успешно поставлена на билете! Пора собираться на встречу 🥂`;
            await sendMessage(authorChatId, authorText);
          }
        } catch (e) {
          console.error("Error fetching author chat id:", e);
        }
      }
    }
    else if (type === 'FEEDBACK') {
      const time = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
      const text = `💌 Новый отзыв с сайта:\n"${payload?.text || ''}"\n🕒 Время: ${time}`;
      await sendMessage(ADMIN_CHAT_ID, text);
    }
    
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

async function sendMessage(chatId: string | number, text: string) {
  if (!chatId) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
