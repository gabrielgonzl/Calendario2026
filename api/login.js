module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const correctPassword = process.env.pass;

  if (!correctPassword) {
    return res.status(503).json({ error: 'Autenticación no disponible' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }

  const { password } = body || {};

  if (password === correctPassword) {
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Contraseña incorrecta' });
};
