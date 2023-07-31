import express from "express";
import conFigViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

conFigViewEngine(app);
initWebRoutes(app);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
