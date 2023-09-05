import db from "../models/index.js";

const getAllRole = async () => {
  try {
    let roles = await db.Role.findAll({
      order: [["id", "DESC"]],
    });
    if (roles) {
      return {
        EM: "Get data success",
        EC: 0,
        DT: roles,
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Get data error",
      EC: 1,
      DT: [],
    };
  }
};

const createNewRole = async (roles) => {
  try {
    let currentRoles = await db.Role.findAll({
      attributes: ["url", "description"],
      raw: true,
    });
    const persist = Object.values(roles).filter(
      ({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url1 === url2)
    );
    if (persist.length === 0) {
      return {
        EM: "Nothing to create...",
        EC: 0,
        DT: [],
      };
    }
    await db.Role.bulkCreate(persist);
    return {
      EM: "Created new roles success",
      EC: 0,
      DT: [],
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Get data error",
      EC: 1,
      DT: [],
    };
  }
};

const deleteRole = async (id) => {
  try {
    let role = await db.Role.findOne({
      where: { id: id },
    });

    if (role) {
      await role.destroy();
      return {
        EM: "Deleted role success",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Role not found",
        EC: 1,
        DT: [],
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Get data error",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  createNewRole,
  getAllRole,
  deleteRole,
};
