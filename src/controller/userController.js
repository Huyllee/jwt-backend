import userApiService from "../service/userApiService";

const handleGetUsers = async (req, res) => {
  try {
    let data = await userApiService.getAllUser();

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server..",
      EC: -1,
      DT: "",
    });
  }
};

const handlePostUser = async (req, res) => {
  try {
    let users = await userApiService.handleGetUsers();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server..",
      EC: -1,
      DT: "",
    });
  }
};

const handlePutUser = async (req, res) => {
  try {
    let users = await userApiService.handleGetUsers();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server..",
      EC: -1,
      DT: "",
    });
  }
};

const handleDeleteUser = async (req, res) => {
  try {
    let users = await userApiService.handleGetUsers();
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server..",
      EC: -1,
      DT: "",
    });
  }
};

module.exports = {
  handleGetUsers,
  handlePostUser,
  handlePutUser,
  handleDeleteUser,
};
