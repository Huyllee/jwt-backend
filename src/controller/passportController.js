import passport from "passport";
import localStrategy from "passport-local";
import loginRegisterService from "../service/loginRegisterService";

const configPassport = () => {
  try {
    passport.use(
      new localStrategy({ passReqToCallback: true }, async function verify(
        req,
        username,
        password,
        cb
      ) {
        const rawData = {
          valueLogin: username,
          password: password,
        };
        let res = await loginRegisterService.loginUser(rawData);

        if (res && +res.EC === 0) {
          console.log(res);
          return cb(null, res.DT);
        } else {
          return cb(null, false, { message: res.EM });
        }
      })
    );
  } catch (err) {
    console.log(err);
    return {
      EM: "Error from server...",
      EC: -1,
      DT: "",
    };
  }
};

const handleLogout = (req, res) => {
  // req.logout();
  // return res.redirect("/login");

  req.session.destroy(function () {
    req.logout();
    return res.redirect("/login");
  });
};

module.exports = {
  configPassport,
  handleLogout,
};
