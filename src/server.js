import express from "express";
import conFigViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import ApiRoutes from "./routes/api";
import bodyParser from "body-parser";
import configCORS from "./config/cors";
import cookieParser from "cookie-parser";
import { configPassport } from "./controller/passportController";

require("dotenv").config();

const app = express();
configCORS(app);

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

conFigViewEngine(app);
initWebRoutes(app);
ApiRoutes(app);

app.use((req, res) => {
  return res.send("404 Not Found");
});

configPassport();

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
