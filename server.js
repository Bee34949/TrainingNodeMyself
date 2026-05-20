const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const app = require('./app');
const http = require('http');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
console.log(`Running in ${process.env.NODE_ENV || 'development'} mode`);
const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/myapp';

const port = process.env.PORT || 3777;
app.set('port', port);

app.use(require('cors')());
app.use(express.json());

const server = http.createServer(app);
server.listen(port, () => console.log(`Server is running on port ${port}`));
server.on('error', err => { console.error(err); process.exit(1); });

mongoose.connect(dbUrl)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));



