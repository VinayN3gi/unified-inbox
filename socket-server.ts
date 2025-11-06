import { createServer } from "http";
import { Server, Socket } from "socket.io";
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  path: "/socket.io",
});

interface EmitRequest {
  room: string;
  event: string;
  data: any;
}

io.on("connection", (socket: Socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("joinRoom", (contactId: string) => {
    socket.join(contactId);
    console.log(`📥 Socket ${socket.id} joined room: ${contactId}`);
  });

  socket.on("sendMessage", (msg: any) => {
    io.to(msg.contactId).emit("newMessage", msg);
    console.log(`📤 Message sent to room: ${msg.contactId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

// HTTP endpoint to emit events (for webhooks)
app.post("/emit", (req: Request<{}, {}, EmitRequest>, res: Response) => {
  const { room, event, data } = req.body;
  
  if (!room || !event || !data) {
    return res.status(400).json({ error: "Missing room, event, or data" });
  }

  io.to(room).emit(event, data);
  console.log(`📡 Emitted ${event} to room ${room}`);
  
  res.json({ success: true });
});

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", clients: io.engine.clientsCount });
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  httpServer.close(() => {
    console.log("HTTP server closed");
  });
});