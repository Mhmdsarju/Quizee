import { Server } from "socket.io";
import { logger } from "../utils/logger.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://admin.localhost:5173",
      ],
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      logger.info(`Socket disconnected: ${socket.id} | reason: ${reason}`);
    });
  });

  logger.info("Socket.io initialized");
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};

export const closeSocket = async () => {
  if (io) {
    await io.close();
    logger.info("Socket.io server closed");
  }
};
