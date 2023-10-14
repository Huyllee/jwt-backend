import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
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

  const OTP = Math.floor(100000 + Math.random() * 900000);

  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: "SSO Backend 👻", // sender address
      to: `${req.body.email}`, // list of receivers
      subject: "Reset Password ✔", // Subject line
      html: `<b>Bạn nhận được email này, do yêu cầu reset mât khẩu</b>
        <div>Your OTP: ${OTP}</div>`, // html body
    });
    //update code in database
    await loginRegisterService.updateUserCode(OTP, req.body.email);
  } catch (e) {
    console.log(e);
  }

  return res.status(200).json({
    EM: "Success",
    EC: 0,
    DT: { email: req.body.email },
  });
};

module.exports = {
  handleGetLoginPage,
  verifySSOToken,
  handleResetPassword,
  sendCode,
};
