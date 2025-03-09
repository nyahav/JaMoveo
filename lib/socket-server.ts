import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  }
}

let io: SocketIOServer | null = null

export const initSocketServer = (res: NextApiResponse) => {
  if (!io) {
    const httpServer: NetServer = (res as any).socket.server
    io = new SocketIOServer(httpServer, {
      path: '/api/socketio',
      addTrailingSlash: false,
    })

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
  return io
}