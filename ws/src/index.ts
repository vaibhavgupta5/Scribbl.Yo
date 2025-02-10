import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("setStroke", (data) => {
    console.log("Broadcasting stroke:", data);
    io.emit("getStroke", data);
  });

  socket.on("chat", (data) => {
    console.log("Broadcasting chat:", data);
    socket.broadcast.emit("chat", data);
  });

  socket.on("score", (data) => {
    console.log("Broadcasting score:", data);
    socket.broadcast.emit("score", data);
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = 8000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
