import loginRegisterService from "../service/loginRegisterService";

const testApi = (req, res) => {
  return res.status(200).json({
    message: "ok",
    data: "test",
  });
};

const handleRegister = async (req, res) => {
  try {
    let dataUser = req.body;
    if (!dataUser.email || !dataUser.phone || !dataUser.password) {
      return res.status(500).json({
        EM: "Missing required parameter",
        EC: 1,
        DT: "",
      });
    }
    if (dataUser.password && dataUser.password.length < 5) {
      return res.status(500).json({
        EM: "Your password must have more than 5 letters",
        EC: 1,
        DT: "",
      });
    }

    let data = await loginRegisterService.registerNewUser(dataUser);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      EM: "error from server..", //error message
      EC: -1, //error code
      DT: "", //data
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    let dataLogin = req.body;
    if (!dataLogin.valueLogin || !dataLogin.password) {
      return res.status(500).json({
        EM: "Missing required parameter",
        EC: 1,
        DT: "",
      });
    }
    if (dataLogin.password && dataLogin.password.length < 5) {
      return res.status(500).json({
        EM: "Your password must have more than 5 letters",
        EC: 1,
        DT: "",
      });
    }

    let data = await loginRegisterService.loginUser(dataLogin);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      EM: "error from server..",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  testApi,
  handleRegister,
  handleLogin,
};
