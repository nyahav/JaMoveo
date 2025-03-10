import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    console.log('Attempting socket connection...');
    const socketInstance = io({
      path: '/api/socketio',
      addTrailingSlash: false,
    });

    socketInstance.on('connect', () => {
      console.log('Connected to socket server:', socketInstance.id);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socketInstance.on('admin-status', (data) => {
      console.log('Received admin status:', data);
    });
    socketInstance.on('song-selected', (data) => {
      console.log('song-selected:', data);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  return socket;
}