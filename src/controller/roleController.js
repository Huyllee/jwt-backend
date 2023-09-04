import roleApiService from "../service/roleApiService";

const handleGetRoles = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server..",
      EC: -1,
      DT: "",
    });
  }
};

const handlePostRole = async (req, res) => {
  try {
    let data = await roleApiService.createNewRole(req.body);

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

const handlePutRole = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server..",
      EC: -1,
      DT: "",
    });
  }
};

const handleDeleteRole = async (req, res) => {
  try {
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
  handleGetRoles,
  handlePostRole,
  handlePutRole,
  handleDeleteRole,
};
