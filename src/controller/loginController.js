import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
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
        domain: process.env.COOKIE_DOMAIN,
        path: "/",
      });
      res.cookie("refresh_token", refreshToken, {
        maxAge: process.env.MAX_AGE_REFRESH_TOKEN,
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
        path: "/",
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

const handleResetPassword = (req, res) => {
  return res.render("forgot-password.ejs");
};

const sendCode = async (req, res) => {
  //validate email, check type account equal local
  let checkEmailLocal = await loginRegisterService.isEmailLocal(req.body.email);
  if (!checkEmailLocal) {
    return res.status(401).json({
      DT: "",
      EM: "Not found user",
      EC: -1,
    });
  }
  //send code via email
  const OTP = Math.floor(100000 + Math.random() * 900000);
  const __dirname = path.resolve();
  const filePath = path.join(__dirname, "./src/templates/reset-password.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const replacements = {
    email: req.body.email,
    otp: OTP,
  };
  const htmlToSend = template(replacements);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.GOOGLE_APP_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  res.status(200).json({
    EM: "Success",
    EC: 0,
    DT: { email: req.body.email },
  });

  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: `SSO Backend 👻 <${process.env.GOOGLE_APP_EMAIL}>`, // sender address
      to: `${req.body.email}`, // list of receivers
      subject: "Reset Password ✔", // Subject line
      html: htmlToSend, // html body
    });
    //update code in database
    await loginRegisterService.updateUserCode(OTP, req.body.email);
  } catch (e) {
    console.log(e);
  }
};

const submitResetPassword = async (req, res) => {
  try {
    let result = await loginRegisterService.resetUserPassword(req.body);
    if (result === true) {
      res.status(200).json({
        EM: "Success",
        EC: 0,
        DT: "",
      });
    } else {
      res.status(500).json({
        EC: -1,
        EM: "Reset password error...",
        DT: "",
      });
    }
  } catch (e) {
    res.status(500).json({
      EC: -2,
      EM: "Internal error",
      DT: "",
    });
  }
};

module.exports = {
  handleGetLoginPage,
  verifySSOToken,
  handleResetPassword,
  sendCode,
  submitResetPassword,
};
