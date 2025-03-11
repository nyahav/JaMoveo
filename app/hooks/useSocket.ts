import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socketInstance: Socket | null = null; // Singleton pattern

export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!socketInstance) {
      console.log('Initializing new socket connection...');
      socketInstance = io({
        path: '/api/socketio',
        addTrailingSlash: false,
      });

      socketInstance.on('connect', () => {
        console.log('Connected to socket server:', socketInstance?.id);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socketInstance.on('admin-status', (data) => {
        console.log('Received admin status:', data);
      });

      socketInstance.on('live-player', (data) => {
        console.log('live-player useSocket:', data);
      });
      socketInstance.on('song-selected', (data) => {
        console.log('song-selected useSocket:', data);
      });
      socketInstance.on('request-song-data', (data) => {
        console.log('request-song-data useSocket:', data);
      });

      

      // Debugging: Log all socket events
      socketInstance.onAny((eventName, ...args) => {
        console.log(`Socket event received: ${eventName}`, args);
      });
    }

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        console.log('Disconnecting socket...');
        socketInstance.disconnect();
        socketInstance = null;
      }
    };
  }, []);

  return socket;
}
