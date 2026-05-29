const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const mongoDB = require('./db');
const bodyParser = require('body-parser');
const path = require('path');

mongoDB();

// Body size limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://cspiles.vercel.app'
];

// cors options with runtime validation + credentials support if needed
const corsOptions = {
  origin: function (origin, callback) {
    // If no origin (e.g. server-to-server, Postman), allow it. Change if you want stricter.
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      console.warn('Blocked CORS request from origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept',
  credentials: true, // set to true if you send cookies/auth from client; otherwise set false
  preflightContinue: false, // let cors send the response
  optionsSuccessStatus: 204
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Ensure preflight OPTIONS are handled for all routes
app.options('*', cors(corsOptions));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug helper — remove in production
app.use((req, res, next) => {
  // Helpful for debugging CORS issues: logs origin and method
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Express JSON & routes
app.use(express.json());
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));
app.use('/api', require('./Routes/TestApi'));
app.use('/api', require('./Routes/ForgotPassword'));

// Fallback to add CORS headers if something else bypassed it (defensive)
app.use((req, res, next) => {
  if (!res.getHeader('Access-Control-Allow-Origin')) {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    }
  }
  next();
});

// Root
app.get('/', (req, res) => res.send('Hello World!'));

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
