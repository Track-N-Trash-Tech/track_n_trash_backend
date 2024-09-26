const express = require("express");
const axios = require("axios");

const port = 5000; 
const cors = require("cors");
const bodyParser = require('body-parser');

const http = require('http');
const { Server } = require('socket.io'); 

const truckRoutes = require('./routes/truckRoutes');
const mapRoutes = require('./routes/mapRoutes');
const litterLogRoutes = require('./routes/litterLogRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const binRoutes = require('./routes/binRoutes');
const scheduleroutes = require('./routes/scheduleRoutes');
require('dotenv').config();
require('./db/db');  



const app = express();
const server = http.createServer(app); 

const io = new Server(server, {
  cors: {
    origin: ['https://google-maps-component.vercel.app','http://localhost:3000'], 
    methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
  },
  transports: ["websocket", "polling"], // Make sure WebSocket transport is allowed
 
});

const corsOptions = {
  origin: ['https://google-maps-component.vercel.app','http://localhost:3000'], 
  credentials: true,
};

app.use(cors(corsOptions));

//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to make io accessible to route handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware to use routes
app.use('/bins', binRoutes);
app.use('/map', mapRoutes);
app.use('/truck', truckRoutes);
app.use('/events', eventRoutes); 
app.use('/litterlogs', litterLogRoutes);
app.use('/users', userRoutes);
app.use('/schedulerequests', scheduleroutes);

// Socket.io instance to be used in the controllers
app.set('socketio', io);


// Listen for socket connections
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Handle socket events here
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});


// Start the server
server.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});


