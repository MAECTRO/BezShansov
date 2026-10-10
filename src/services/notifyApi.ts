// src/services/notifyApi.ts
// Умный диспетчер уведомлений для связки Vercel + GitHub Pages

export async function sendNotification(type: 'TICKET_CREATED' | 'TICKET_SIGNED' | 'FEEDBACK', payload: any): Promise<void> {
  const body = JSON.stringify({ type, payload });
  const headers = { 'Content-Type': 'application/json' };

  try {
    // 1. Пробуем локальный эндпоинт (работает на Vercel)
    const localRes = await fetch('/api/notify', {
      method: 'POST',
      headers,
      body,
    }).catch(() => null);

    if (localRes && localRes.ok) {
      return;
    }

    // 2. Если на статическом GitHub Pages вернулся 404, шлём напрямую на Vercel бэкенд
    await fetch('https://bez-shansov.vercel.app/api/notify', {
      method: 'POST',
      headers,
      body,
    }).catch(() => null);
  } catch (e) {
    console.warn('[Notify API] Failed to deliver event:', e);
  }
}
