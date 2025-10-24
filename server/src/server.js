import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
import './types.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import declarationRoutes from './routes/declarations.js';
import validationRoutes from './routes/validation.js';
import statusRoutes from './routes/status.js';
import importerRoutes from "./routes/importers.js";
import exporterRoutes from "./routes/exporters.js";
import catalogRoutes from "./routes/catalogs.js";

const app = express();

// --- CORS (mínimo y correcto) ---
app.set('trust proxy', 1); // necesario detrás de Render/NGINX si usas cookies secure

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .concat(['http://localhost:5173', 'http://localhost:3000']);

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                 // permite curl/health
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Authorization','Content-Type','Accept','Origin','X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight para todo
// --- fin CORS ---

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/declarations', declarationRoutes);
app.use('/validation', validationRoutes);
app.use('/status', statusRoutes);
app.use("/admin/importers", importerRoutes);  
app.use("/catalogs", catalogRoutes);
app.use("/admin/exporters", exporterRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

process.on('unhandledRejection', (e)=>console.error('UNHANDLED REJECTION', e));
process.on('uncaughtException', (e)=>console.error('UNCAUGHT EXCEPTION', e));

export default app;
