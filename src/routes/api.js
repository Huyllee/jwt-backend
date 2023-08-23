import express from "express";
import apiController from "../controller/apiController";
import userController from "../controller/userController";
import groupController from "../controller/groupController";
import { checkUserJWT, checkUserPermission } from "../middleware/jwtAction";

const router = express.Router();

// const checkUserLogin=(req,res,next)=>{
//   const nonSecurePaths = [
//     '/',
//     '/register',
//     "/login"
//   ]

//   if(nonSecurePaths.includes(req.path)) return next();

//   //auth user
//   if(user){
//     next()
//   }else{

//   }
// }

const ApiRoutes = (app) => {
  router.post("/register", apiController.handleRegister);
  router.post("/login", apiController.handleLogin);

  router.get("/get/users", checkUserJWT, userController.handleGetUsers);
  router.post("/post/user", userController.handlePostUser);
  router.put("/put/user", userController.handlePutUser);
  router.delete("/delete/user", userController.handleDeleteUser);

  router.get("/get/groups", groupController.handleGetGroups);

  return app.use("/api/v1/", router);
};

export default ApiRoutes;
