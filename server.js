const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const connectDB = require('./config/db');
// Load env vars
dotenv.config({ path: './config/config.env' });
// Connect to database
connectDB();
// Route files
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');
const appointment = require('./routes/appointment');

const app = express();
// Body parser
app.use(express.json());
// Cookie parser
app.use(cookieParser());
// Sanitize data
app.use(mongoSanitize());
// Helmet
app.use(helmet());
// Prevent XSS attacks
app.use(xss());
// Rate Limiting
const limiter = rateLimit({
  windowsMS: 10 * 60 * 1000,
  max: 1
});
app.use(limiter);
// Prevent http params pollutions
app.use(hpp());
// Prevent http params pollutions
app.use(cors());
// Mount routers REST
app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointment);
const PORT = process.env.PORT || 5000; // || == or (PORT or 5000)

const server = app.listen(
  PORT,
  console.log(
    'Server running in ',
    process.env.NODE_ENV,
    ' mode on port ',
    PORT
  )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit);
});
