import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();
export const ServerSocket = new Server(httpServer);
ServerSocket.on("connection", (socket) => {});
httpServer.listen(9901);
