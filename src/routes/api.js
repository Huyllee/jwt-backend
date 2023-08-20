import express from "express";
import apiController from "../controller/apiController";
import userController from "../controller/userController";
import groupController from "../controller/groupController";

const router = express.Router();

const ApiRoutes = (app) => {
  router.get("/test-api", apiController.testApi);
  router.post("/register", apiController.handleRegister);
  router.post("/login", apiController.handleLogin);

  router.get("/get/users", userController.handleGetUsers);
  router.post("/post/user", userController.handlePostUser);
  router.put("/put/user", userController.handlePutUser);
  router.delete("/delete/user", userController.handleDeleteUser);

  router.get("/get/groups", groupController.handleGetGroups);

  return app.use("/api/v1/", router);
};

export default ApiRoutes;
