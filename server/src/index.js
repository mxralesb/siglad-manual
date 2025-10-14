import 'dotenv/config';
import app from './server.js';
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`SIGLAD API listening on http://localhost:${PORT}`));
