export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, nama, tanggalLahir, usia, pekerjaan, alamat, status } = req.body;

  if (!phone || !nama || !tanggalLahir || !usia || !pekerjaan || !alamat || !status) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  const usiaNum = parseInt(usia);
  if (isNaN(usiaNum) || usiaNum < 1 || usiaNum > 120) {
    return res.status(400).json({ error: 'Usia tidak valid' });
  }

  const waktu = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

  const text = `
📋 *DATA PERMINTAAN - STORE*
━━━━━━━━━━━━━━━━
📱 *No. HP:* ${phone}
👤 *Nama:* ${nama}
🎂 *Tanggal Lahir:* ${tanggalLahir}
🔢 *Usia:* ${usia} tahun
💼 *Pekerjaan:* ${pekerjaan}
🏠 *Alamat:* ${alamat}
💍 *Status:* ${status}
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