// const express = require('express')
// const cors = require('cors')
// const app = express()
// const port = 3001
// const mongoDB = require("./db")
// const nodemailer = require('nodemailer');
// const bodyParser = require('body-parser');
// var path = require('path');
// // const { job } = require('./cron');
// mongoDB();

// // Set maximum payload size limit
// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// // app.use(cors())

// // job.start(); 

// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "https://cspiles.vercel.app",
//   ],
//   methods: "GET, POST, OPTIONS, PUT, DELETE",
//   allowedHeaders: "Content-Type, Authorization, Origin, X-Requested-With, Accept"
// };

// app.use(cors(corsOptions));

// // app.use((req, res, next) => {
// //   const corsWhitelist = [
// //     "http://localhost:5173",
// //     "https://invoice-al.vercel.app",
// // ];
// // if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
// //     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
// //     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
// //     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Origin, X-Requested-With, Accept");
// // }
// //   next();
// // });


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.use(express.json())
// app.use('/api', require("./Routes/CreateUser"));
// app.use('/api', require("./Routes/DisplayData"));
// app.use('/api', require("./Routes/OrderData"));
// app.use('/api', require("./Routes/TestApi"));
// app.use('/api', require("./Routes/ForgotPassword"));

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// invoiceServer/index.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const connectDB = require('./db'); // should export a connect function that caches the connection
// const { job } = require('./cron'); // do NOT start persistent jobs here

const app = express();

// --- CORS preflight/whitelist middleware (MUST run BEFORE body-parsers and routes) ---
const allowedOrigins = new Set([
  'http://localhost:5173',
  'https://cspiles.vercel.app'
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Origin, X-Requested-With, Accept'
  );
  // optional: allow cookies if you need them (then use credentials on client)
  // res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    // short-circuit preflight requests
    return res.status(204).end();
  }
  next();
});
// --- end CORS middleware ---

// Body payload limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json()); // safe to keep

// lightweight request logger for debugging on Vercel (remove in production)
app.use((req, res, next) => {
  // Avoid logging huge binary bodies in production. This is for debugging short JSON payloads.
  console.log('---REQ LOG START---');
  console.log('Time:', new Date().toISOString());
  console.log('Method:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Headers:', {
    origin: req.headers.origin,
    'content-type': req.headers['content-type'],
    'user-agent': req.headers['user-agent']
  });
  console.log('Body:', req.body);
  console.log('---REQ LOG END---');
  next();
});

// Simple request line logger (optional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Connect to DB (serverless-safe — your ./db should implement caching)
connectDB().then(() => {
  console.log('DB connected (or connection promise initiated)');
}).catch(err => {
  console.error('DB connection error (will try again on demand):', err);
});

// Static uploads folder (note: runtime filesystem is ephemeral on Vercel)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health / simple root route
app.get('/', (req, res) => res.send('API running'));

// Routes (case-sensitive file names must match)
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));
app.use('/api', require('./Routes/TestApi'));
app.use('/api', require('./Routes/ForgotPassword'));

// Local dev port (not used by Vercel). Use a separate dev-server if you want to `listen()` locally.
// const port = process.env.PORT || 3001;
// app.listen(port, () => { console.log(`Local dev server listening on http://localhost:${port}`); });

// IMPORTANT: export the app for @vercel/node instead of calling app.listen()
module.exports = app;