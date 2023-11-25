import { io } from "socket.io-client";

const url2 = "http://192.168.0.252:7070";
import AppSetting from "../models/appsetting.js";
import { ServerSocket } from "./server.js";

export const socket = io(url2, {});

socket.on("connect", async () => {
  const setting = await AppSetting.findOne();
  socket.emit("connectname", setting.storeName);
  ServerSocket.emit("notification", "connectedToServer");
});
socket.on("newTransfer", (data) => {
  console.log(data);
  ServerSocket.emit("notification", `มีของส่งมาจาก${data.from}`);
});
