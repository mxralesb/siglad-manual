import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { logAudit } from '../middleware/audit.js';
import multer from 'multer';
import fetch from 'node-fetch';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/pending', requireAuth, requireRole('AGENTE'), async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT id, numero_documento, fecha_emision, importador_nombre, exportador_nombre, valor_aduana_total, moneda, estado
     FROM declarations 
     WHERE estado='PENDIENTE' 
     ORDER BY created_at ASC`
  );
  res.json(rows);
});

router.post('/:id/decision', requireAuth, requireRole('AGENTE'), async (req, res) => {
  const { id } = req.params;
  const { decision, comentario } = req.body || {};
  if (!['VALIDADA', 'RECHAZADA'].includes(decision)) return res.status(400).json({ error: 'decision must be VALIDADA or RECHAZADA' });

  const r = await pool.query(
    `UPDATE declarations
     SET estado=$1, agente_user_id=$2, comentario_agente=$3, validated_at=NOW()
     WHERE id=$4 AND estado='PENDIENTE'
     RETURNING id, numero_documento`,
    [decision, req.user.sub, comentario || null, id]
  );
  if (!r.rows[0]) return res.status(404).json({ error: 'Declaration not found or already processed' });

  const num = r.rows[0].numero_documento;
  await logAudit({ userId: req.user.sub, action: 'VALIDATE', entity: 'DECLARATION', entityId: id, operation: 'Validación DUCA', result: 'EXITO', num_declaracion: num, req, details: `Decision=${decision}` });
  res.json({ ok: true, id, estado: decision });
});

router.post('/ai/validar-carga', upload.single('file'), async (req, res) => {
  try {
    const vehiculo_tipo = req.body?.vehiculo_tipo || 'cabezal_furgon';
    if (!req.file) return res.status(400).json({ error: 'file_required' });
    const imgBase64 = req.file.buffer.toString('base64');
    const ai = await fetch(process.env.AI_URL + '/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: imgBase64, vehiculo_tipo })
    }).then(x => x.json());
    res.json(ai);
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

export default router;
