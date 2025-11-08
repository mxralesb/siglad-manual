CREATE TABLE IF NOT EXISTS validaciones_carga (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER,
  vehiculo_tipo TEXT NOT NULL,
  foto_url TEXT,
  alto_m NUMERIC(6,2),
  ancho_m NUMERIC(6,2),
  limite_alto_m NUMERIC(6,2),
  limite_ancho_m NUMERIC(6,2),
  regla_fuente TEXT,
  resultado TEXT NOT NULL,
  motivos JSONB,
  creado_en TIMESTAMP DEFAULT NOW()
);
