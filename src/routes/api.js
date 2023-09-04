import express from "express";
import apiController from "../controller/apiController";
import userController from "../controller/userController";
import groupController from "../controller/groupController";
import roleController from "../controller/roleController";
import { checkUserJWT, checkUserPermission } from "../middleware/jwtAction";

const router = express.Router();

const ApiRoutes = (app) => {
  router.all("*", checkUserJWT, checkUserPermission);

  router.post("/register", apiController.handleRegister);
  router.post("/login", apiController.handleLogin);
  router.post("/logout", apiController.handleLogout);
  router.get("/account", userController.handleUserAccount);

  //user routes
  router.get("/get/users", userController.handleGetUsers);
  router.post("/post/user", userController.handlePostUser);
  router.put("/put/user", userController.handlePutUser);
  router.delete("/delete/user", userController.handleDeleteUser);

  //roles routes
  router.get("/get/role", roleController.handleGetRoles);
  router.post("/post/role", roleController.handlePostRole);
  router.put("/put/role", roleController.handlePutRole);
  router.delete("/delete/role", roleController.handleDeleteRole);

  //groups routes
  router.get("/get/groups", groupController.handleGetGroups);

  return app.use("/api/v1/", router);
};

export default ApiRoutes;
