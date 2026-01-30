import app from "./app.js";
import { initSocket } from "./src/config/socket.js";
import http from "http";


const PORT=5005;

const server = http.createServer(app);

initSocket(server);


server.listen(PORT,()=>{
  console.log(`Server running: http://localhost:${PORT}`);
})