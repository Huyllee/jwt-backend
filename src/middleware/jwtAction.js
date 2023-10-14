import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import loginRegisterService from "../service/loginRegisterService";
require("dotenv").config();

const nonSecurePaths = [
  "/",
  "/register",
  "/login",
  "/logout",
  "/verify-service-jwt",
];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRES_IN });
  } catch (err) {
    console.log(err);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;

  try {
    decoded = jwt.verify(token, key);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return "TokenExpiredError";
    }
    // console.log(err);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = async (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);

  if ((cookies && cookies.access_token) || tokenFromHeader) {
    let access_token =
      cookies && cookies.access_token ? cookies.access_token : tokenFromHeader;
    let decoded = verifyToken(access_token);
    if (decoded && decoded !== "TokenExpiredError") {
      decoded.access_token = access_token;
      decoded.refresh_token = cookies.refresh_token;
      req.user = decoded;

      next();
    } else if (decoded && decoded === "TokenExpiredError") {
      //handle refresh token
      if (cookies && cookies.refresh_token) {
        let data = await handleRefreshToken(cookies.refresh_token);
        let newAccessToken = data.newAccessToken;
        let newRefreshToken = data.newRefreshToken;

        //set cookies
        if (newAccessToken && newRefreshToken) {
          res.cookie("access_token", newAccessToken, {
            maxAge: 900 * 1000,
            httpOnly: true,
            domain: process.env.COOKIE_DOMAIN,
            path: "/",
          });
          res.cookie("refresh_token", newRefreshToken, {
            maxAge: 3600 * 1000,
            httpOnly: true,
            domain: process.env.COOKIE_DOMAIN,
            path: "/",
          });
        }

        return res.status(405).json({
          EC: -1,
          EM: "Need to retry with new token",
          DT: "",
        });
      } else {
        return res.status(401).json({
          EC: -1,
          EM: "Not authenticated the user",
          DT: "",
        });
      }
    } else {
      return res.status(401).json({
        EC: -1,
        EM: "Not authenticated the user",
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      EM: "Not authenticated the user",
      DT: "",
    });
  }
};

const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/account")
    return next();

  if (req.user) {
    let email = req.user.email;
    let roles = req.user.groupWithRole.Roles;
    let currentUrl = req.path;
    if (!roles || roles.length === 0) {
      return res.status(403).json({
        EC: -1,
        EM: `You don't have the permission to access this resource...`,
        DT: "",
      });
    }
    let canAccess = roles.some(
      (item) => item.url === currentUrl || currentUrl.includes(item.url)
    );
    if (canAccess) {
      next();
    } else {
      return res.status(403).json({
        EC: -1,
        EM: `You don't have the permission to access this resource...`,
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      EM: "Not authenticated the user",
      DT: "",
    });
  }
};

const checkServiceJWT = (req, res, next) => {
  let tokenFromHeader = extractToken(req);

  if (tokenFromHeader) {
    let access_token = tokenFromHeader;
    let decoded = verifyToken(access_token);
    if (decoded) {
      return res.status(200).json({
        EC: 0,
        EM: "Verify the user",
        DT: "",
      });
    } else {
      return res.status(401).json({
        EC: -1,
        EM: "Not authenticated the user",
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      EM: "Not authenticated the user",
      DT: "",
    });
  }
};

const handleRefreshToken = async (refreshToken) => {
  let newAccessToken = "",
    newRefreshToken = "";
  //update refreshToken
  let user = await loginRegisterService.getUserByRefreshToken(refreshToken);
  if (user) {
    //create access token
    let payloadAccessToken = {
      email: user.email,
      userName: user.userName,
      groupWithRole: user.groupWithRole,
    };
    newAccessToken = createJWT(payloadAccessToken);
    newRefreshToken = uuidv4();
    //update user with new refreshToken
    await loginRegisterService.updateUserRefreshToken(
      user.email,
      newRefreshToken
    );
  }
  return {
    newAccessToken,
    newRefreshToken,
  };
};

module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
  checkServiceJWT,
};
