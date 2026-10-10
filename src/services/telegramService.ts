import { TELEGRAM_CONFIG } from '../config/telegram';

export interface TicketNotifyPayload {
  guestName: string;
  date: string;
  time: string;
  location: string;
  treat: string;
  drink: string;
  rules: string[];
  secretNote?: string;
  chatId?: string;
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function notifyAuthorOnRSVP(data: TicketNotifyPayload) {
  const targetChatId = data.chatId || TELEGRAM_CONFIG.defaultChatId;

  const guest = escapeHtml(data.guestName || 'Любимый Человек');
  const date = escapeHtml(data.date);
  const time = escapeHtml(data.time);
  const location = escapeHtml(data.location);
  const treat = escapeHtml(data.treat);
  const drink = escapeHtml(data.drink);
  const rulesList =
    data.rules.length > 0
      ? data.rules.map((r) => `• ${escapeHtml(r)}`).join('\n')
      : '• Стандартные условия';

  const text = `
🎉 <b>ПАЖАЛСТА! Твой билет подписан!</b>

👤 <b>Гость:</b> ${guest}
📅 <b>Когда:</b> ${date} в ${time}
📍 <b>Локация:</b> ${location}
🍕 <b>Еда:</b> ${treat}
🥤 <b>Напитки:</b> ${drink}

📜 <b>Условия контракта:</b>
${rulesList}

✍️ <i>Личная подпись успешно поставлена на билете!</i>
`.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text: text,
          parse_mode: 'HTML',
        }),
      }
    );
    const json = await response.json();
    return json;
  } catch (err) {
    console.error('Ошибка отправки в Telegram:', err);
    return null;
  }
}
