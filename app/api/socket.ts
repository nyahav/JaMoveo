import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!res.socket) return;
  const socket = res.socket as SocketWithIO;

  if (socket.server.io) {
    console.log("Socket.io server already running");
    res.end();
    return;
  }

  console.log("Starting new Socket.io server...");
  const io = new Server(socket.server, { path: "/api/socket", cors: { origin: "*" } });
  socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("song-selected", () => {
      io.emit("song-selected");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  res.end();
}
