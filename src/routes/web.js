import express from "express";
import homeController from "../controller/homeController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", homeController.handleHomeController);
  router.get("/user", homeController.handleUserController);
  router.post("/user/create", homeController.handleCreateUserController);

  return app.use("/", router);
};

export default initWebRoutes;
