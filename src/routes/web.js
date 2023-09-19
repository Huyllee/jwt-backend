import express from "express";
import homeController from "../controller/homeController";
import loginController from "../controller/loginController";
import passportController from "../controller/passportController";
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

  app.post("/login", function (req, res, next) {
    passport.authenticate("local", function (error, user, info) {
      if (error) {
        return res.status(500).json(error);
      }
      if (!user) {
        return res.status(401).json(info.message);
      }
      req.login(user, function (err) {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    })(req, res, next);
  });

  router.post("/logout", passportController.handleLogout);

  return app.use("/", router);
};

export default initWebRoutes;
