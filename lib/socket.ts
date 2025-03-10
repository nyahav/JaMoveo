import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export function initSocketIO(httpServer: HTTPServer) {
    if (!io) {
      io = new SocketIOServer(httpServer, {
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
          socket.data.isAdmin = true;
          io?.emit('admin-status', { connected: true });
        });
  
        socket.on('song-selected', (data) => {
          console.log('Song selected:', data);
          io?.emit('song-update', data);
        });
  
        socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
          if (socket.data.isAdmin) {
            io?.emit('admin-status', { connected: false });
          }
        });
      });
    }
    return io;
  }