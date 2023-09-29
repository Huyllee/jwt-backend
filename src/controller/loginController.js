import { v4 as uuidv4 } from "uuid";
import loginRegisterService from "../service/loginRegisterService";
import { createJWT } from "../middleware/jwtAction";
require("dotenv").config();

const handleGetLoginPage = (req, res) => {
  const { serviceURL } = req.query;
  return res.render("login.ejs", {
    redirectURL: serviceURL,
  });
};

const verifySSOToken = async (req, res) => {
  try {
    const { ssoToken } = req.body;
    //check ssoToken
    if (req.user && req.user.code && req.user.code === ssoToken) {
      const refreshToken = uuidv4();
      //update refreshToken
      await loginRegisterService.updateUserRefreshToken(
        req.user.email,
        refreshToken
      );
      //create access token
      let payload = {
        email: req.user.email,
        userName: req.user.userName,
        groupWithRole: req.user.groupWithRole,
      };
      let token = createJWT(payload);
      //set cookies
      res.cookie("access_token", token, {
        maxAge: process.env.MAX_AGE_ACCESS_TOKEN,
        httpOnly: true,
      });
      res.cookie("refresh_token", refreshToken, {
        maxAge: process.env.MAX_AGE_REFRESH_TOKEN,
        httpOnly: true,
      });

      const resData = {
        access_token: token,
        refresh_token: refreshToken,
        email: req.user.email,
        userName: req.user.userName,
        groupWithRole: req.user.groupWithRole,
      };
      //destroy session
      req.session.destroy(function () {
        req.logout();
      });

      return res.status(200).json({
        EM: "ok",
        EC: 0,
        DT: resData,
      });
    } else {
      return res.status(401).json({
        EM: "not match ssoToken",
        EC: 1,
        DT: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      EM: "Error from server...",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  handleGetLoginPage,
  verifySSOToken,
};
