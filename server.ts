import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { SongDetails } from './app/types';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(server, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    
    console.log('Client connected:', socket.id);

    socket.on('admin-connected', (data) => {
      console.log('Admin connected:', socket.id);
      io.emit('admin-status', { connected: true });
    });
    socket.on('live-player', (data) => {
      console.log('Server received live-player:', socket.id);
      io.emit('live-player', data);
    });

    socket.on('request-song-data', (data) => {
      console.log('Server received request-song-data:', socket.id);
      io.emit('request-song-data', data);
    });

    socket.on('song-selected', (data) => {
      console.log('Server received song-selected:', socket.id);
      io.emit('song-selected', data);
    });
    
    socket.on('quit-session', () => {
      console.log('Admin quit-session:');
      io.emit('session-ended');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (socket.data.isAdmin) {
        io.emit('admin-status', { connected: false });
      }
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
