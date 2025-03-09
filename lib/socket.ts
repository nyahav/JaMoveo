import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function getSocketIO() {
  return io;
}

export function initSocketIO(httpServer: any) {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('song-selected', (data) => {
        console.log('Song selected:', data);
        io?.emit('song-update', data);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  return io;
}