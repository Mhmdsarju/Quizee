import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { initSocket, closeSocket } from "./src/config/socket.js";
import { logger } from "./src/utils/logger.js";

const PORT = 5005;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown

const shutdown = async (signal) => {
  logger.warn(`${signal} received. Starting graceful shutdown...`);

  // Stop accepting new requests
  server.close(async () => {
    logger.info("HTTP server closed");

    try {
      // Close socket.io
      if (closeSocket) {
        await closeSocket();
        logger.info("Socket.io closed");
      }

      // Close MongoDB
      await mongoose.connection.close(false);
      logger.info("MongoDB connection closed");

      logger.info("Graceful shutdown completed");
      process.exit(0);
    } catch (err) {
      logger.error("Error during graceful shutdown", err);
      process.exit(1);
    }
  });

  // Force shutdown if taking too long
  setTimeout(() => {
    logger.error("Graceful shutdown timed out. Force exiting.");
    process.exit(1);
  }, 10000); // 10 seconds
};

// Signals
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
