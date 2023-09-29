import { v4 as uuidv4 } from "uuid";
import loginRegisterService from "../service/loginRegisterService";
import { createJWT } from "../middleware/jwtAction";

const handleGetLoginPage = (req, res) => {
  const { serviceURL } = req.query;
  return res.render("login.ejs", {
    redirectURL: serviceURL,
  });
};

const verifySSOToken = async (req, res) => {
  const { ssoToken } = req.body;
  //check ssoToken
  if (req.user && req.user.code && req.user.code === ssoToken) {
    const refreshToken = uuidv4();
    //update refreshToken
    await loginRegisterService.updateUserRefreshToken(
      req.user.email,
      refreshToken
    );
    //create jwt token
    let payload = {
      email: req.user.email,
      userName: req.user.userName,
      groupWithRole: req.user.groupWithRole,
    };
    let token = createJWT(payload);
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
    return res.status(200).json({
      EM: "ok",
      EC: 0,
      DT: "not match",
    });
  }
};

module.exports = {
  handleGetLoginPage,
  verifySSOToken,
};
