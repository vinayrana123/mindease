require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || '*',
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: 'Too many requests, please try again later.' }
  })
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MindEase API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resources', resourceRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MindEase backend listening on port ${PORT}`);
});
