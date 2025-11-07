import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import connectDB from './config/database.js';
import adminRoutes from './routes/admin.js';
import announcementRoutes from './routes/announcement.js';
import galleryRoutes from './routes/gallery.js';
import awardRoutes from './routes/award.js';
import feedbackRoutes from './routes/feedback.js';
import memberRoutes from './routes/member.js';
import nagrikSevaRoutes from './routes/nagrikSevaRoutes.js';
import villageDetailRoutes from './routes/villageDetailRoutes.js';
import programRoutes from './routes/programRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000", 
    "https://government-frontend-steel.vercel.app",
    "https://government-user-frontend.vercel.app",
    "https://sawargaongrampanchayat.site",
    "https://www.sawargaongrampanchayat.site",
    "http://localhost:5174/"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🎯 CACHE PREVENTION MIDDLEWARE - PREVENTS BROWSER CACHING OF API RESPONSES
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/nagrik-seva', nagrikSevaRoutes);
app.use('/api/village-details', villageDetailRoutes);
app.use('/api/programs', programRoutes);
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Government Website API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 CORS enabled for: http://localhost:5173 and http://localhost:3000`);
  console.log(`🔄 Cache prevention enabled for all API routes`);
});
