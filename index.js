import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectToDatabase } from "./function/database.js";
import startServer from "./function/startServer.js";
import AppRoutes from "./routes/appRoutes.js";
import ProductRoutes from "./routes/productRoutes.js";
import ReportRoutes from "./routes/reportRoutes.js";
import "./socket.io/client.js";
import Summary from "./function/Summary.js";
import "./function/BillOnline.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/app", AppRoutes);
app.use("/product", ProductRoutes);
app.use("/report", ReportRoutes);
connectToDatabase();
startServer();
Summary(500);
const port = parseInt(process.env.PORT) || 9900;
app.listen(port, () => {
  console.log(`helloworld: listening on http://localhost:${port}`);
});
