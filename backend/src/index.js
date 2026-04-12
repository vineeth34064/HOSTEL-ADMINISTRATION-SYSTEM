import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import gatePassRoutes from './routes/gatePassRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import parcelRoutes from './routes/parcelRoutes.js';
import messMenuRoutes from './routes/messMenuRoutes.js';
import feesRoutes from './routes/feesRoutes.js';
import lostFoundRoutes from './routes/lostFoundRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import antiRaggingRoutes from './routes/antiRaggingRoutes.js';
import aiChatbotRoutes from './routes/aiChatbotRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust the first proxy (Render uses a load balancer/proxy)
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || /\.onrender\.com$/.test(origin);
    callback(null, true); // Allow all while reflecting request origin for maximum compatibility
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/gatepasses', gatePassRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/mess-menu', messMenuRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/antiragging', antiRaggingRoutes);
app.use('/api/chatbot', aiChatbotRoutes);

// Serve Static Frontend files in Production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Internal server error');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
