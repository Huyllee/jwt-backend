import express from "express";
import homeController from "../controller/homeController";
import apiController from "../controller/apiController";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", homeController.handleHomeController);
  router.get("/user", homeController.handleUserController);
  router.post("/user/create", homeController.handleCreateUserController);
  router.post("/delete/:id", homeController.handleDeleteUserController);
  router.get("/user/:id", homeController.handleGetUserByIdController);
  router.put("/user/update", homeController.handleUpdateUserController);

  router.get("/api/test-api", apiController.testApi);

  return app.use("/", router);
};

export default initWebRoutes;
