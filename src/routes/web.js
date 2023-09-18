import express from "express";
import homeController from "../controller/homeController";
import loginController from "../controller/loginController";
import checkUser from "../middleware/checkUser";
import passport from "passport";

const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", checkUser.isLogin, homeController.handleHomeController);
  router.get("/user", homeController.handleUserController);
  router.post("/user/create", homeController.handleCreateUserController);
  router.post("/delete/:id", homeController.handleDeleteUserController);
  router.get("/user/:id", homeController.handleGetUserByIdController);
  router.put("/user/update", homeController.handleUpdateUserController);

  router.get("/login", checkUser.isLogin, loginController.handleGetLoginPage);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  return app.use("/", router);
};

export default initWebRoutes;
