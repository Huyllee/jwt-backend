import express from "express";
import conFigViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
import connection from './config/connectDB'
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connection();

conFigViewEngine(app);
initWebRoutes(app);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
