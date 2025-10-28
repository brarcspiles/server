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
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const connectDB = require('./db'); // should export a connect function that caches the connection
// const { job } = require('./cron'); // do NOT start persistent jobs here

const app = express();

// Body payload limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json()); // safe to keep

// CORS config
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://cspiles.vercel.app'
  ],
  methods: 'GET, POST, OPTIONS, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
};
app.use(cors(corsOptions));

// Optional: lightweight request logger for debugging on Vercel (remove in production)
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

// IMPORTANT: export the app for @vercel/node instead of calling app.listen()
module.exports = app;