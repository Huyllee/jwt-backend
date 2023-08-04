import express from "express";
import conFigViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import ApiRoutes from "./routes/api";
import bodyParser from "body-parser";
import connection from "./config/connectDB";
import configCORS from "./config/cors";
import { createJWT, verifyToken } from "./middleware/jwtAction";

require("dotenv").config();

const app = express();
configCORS(app);

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connection();

createJWT();
let data = verifyToken(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiaHV5bGVlIiwiYWdlIjoiMjIiLCJpYXQiOjE2OTExNDUzNDd9.OoKzvR9CC8U3cl86awQ4na7LX03qS3JqBEqM45cvN-0"
);
console.log(data);

conFigViewEngine(app);
initWebRoutes(app);
ApiRoutes(app);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
