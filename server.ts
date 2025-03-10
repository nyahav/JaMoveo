import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';

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

    socket.on('song-selected', (selectedSong) => {
      console.log('Song selected by admin:', selectedSong.name);
      io.emit('song-update', {
        name: selectedSong.name,
        redirect: true
      });
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
