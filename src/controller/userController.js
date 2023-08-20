import userApiService from "../service/userApiService";

const handleGetUsers = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await userApiService.getUserWithPagination(+page, +limit);

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await userApiService.getAllUser();

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
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
    let data = await userApiService.createNewUser(req.body);

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
    let userId = req.body.userId;
    let user = await userApiService.deleteUser(userId);
    return res.status(200).json({
      EM: user.EM,
      EC: user.EC,
      DT: user.DT,
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

module.exports = {
  handleGetUsers,
  handlePostUser,
  handlePutUser,
  handleDeleteUser,
};
