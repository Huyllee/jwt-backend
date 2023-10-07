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

  router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (error, user, info) {
      if (error) {
        return res.status(500).json(error);
      }
      if (!user) {
        return res.status(401).json(info.message);
      }
      req.login(user, function (err) {
        if (err) return next(err);
        // return res.redirect(req.body.serviceURL);
        return res
          .status(200)
          .json({ ...user, redirectURL: req.body.serviceURL });
      });
    })(req, res, next);
  });

  router.post("/logout", passportController.handleLogout);
  router.post("/verify-token", loginController.verifySSOToken);

  router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  router.get(
    "/google/redirect",
    passport.authenticate("google", {
      failureRedirect: "/login",
    }),
    (req, res) => {
      return res.render("social.ejs", { ssoToken: req.user.code });
    }
  );

  router.get(
    "/auth/facebook",
    passport.authorize("facebook", { scope: ["public_profile"] })
  );

  router.get(
    "/facebook/redirect",
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    function (req, res) {
      return res.render("social.ejs", { ssoToken: req.user.code });
    }
  );

  return app.use("/", router);
};

export default initWebRoutes;
