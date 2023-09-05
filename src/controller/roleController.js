import roleApiService from "../service/roleApiService";

const handleGetRoles = async (req, res) => {
  try {
    let data = await roleApiService.getAllRole();

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

const handleGetRoleByGroup = async (req, res) => {
  try {
    let groupId = req.params.groupId;
    let data = await roleApiService.getRoleByGroup(groupId);

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
    let roleId = req.body.roleId;
    let role = await roleApiService.deleteRole(roleId);
    return res.status(200).json({
      EM: role.EM,
      EC: role.EC,
      DT: role.DT,
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
  handleGetRoleByGroup,
  handleGetRoles,
  handlePostRole,
  handlePutRole,
  handleDeleteRole,
};
