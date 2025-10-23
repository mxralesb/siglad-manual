import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { logAudit } from '../middleware/audit.js';

const router = Router();

router.get('/mine', requireAuth, async (req, res) => {
  const { role, sub } = req.user || {};
  if (role !== 'TRANSPORTISTA') return res.status(403).json({ error: 'Only TRANSPORTISTA can view own declarations' });
  
  try {
    const { fechaInicio, fechaFin } = req.query;
    let query = `
      SELECT 
        id, 
        numero_documento, 
        estado, 
        fecha_emision,
        pais_emisor,
        tipo_operacion,
        medio_transporte,
        exportador_nombre,
        importador_nombre,
        moneda,
        valor_aduana_total,
        created_at
      FROM declarations
      WHERE owner_user_id = $1`;
    
    const params = [sub];
    
    // Agregar filtros de fecha si se proporcionan
    if (fechaInicio && fechaFin) {
      query += ` AND fecha_emision BETWEEN $2 AND $3`;
      params.push(fechaInicio, fechaFin);
    } else if (fechaInicio) {
      query += ` AND fecha_emision >= $2`;
      params.push(fechaInicio);
    } else if (fechaFin) {
      query += ` AND fecha_emision <= $2`;
      params.push(fechaFin);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const { rows } = await pool.query(query, params);
    
    await logAudit({ 
      userId: sub, 
      action: 'VIEW', 
      entity: 'DECLARATION', 
      operation: 'Consulta Declaraciones', 
      result: 'EXITO', 
      req,
      details: fechaInicio || fechaFin ? `Filtro: ${fechaInicio || ''} - ${fechaFin || ''}` : undefined
    });
    
    res.json(rows);
  } catch (error) {
    console.error('Error en /status/mine:', error);
    await logAudit({ 
      userId: sub, 
      action: 'VIEW', 
      entity: 'DECLARATION', 
      operation: 'Consulta Declaraciones', 
      result: 'FALLO', 
      req,
      details: error.message
    });
    res.status(500).json({ error: 'No se pudo obtener las declaraciones' });
  }
});

export default router;
