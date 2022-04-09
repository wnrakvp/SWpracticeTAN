const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
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
  max: 100,
});
app.use(limiter);
// Prevent http params pollutions
app.use(hpp());
// Enable CORS
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express VacQ API',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
      }
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
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
