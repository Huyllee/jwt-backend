import db from "../models/index";

const getAllUser = async () => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "userName", "email", "phone", "gender"],
      include: { model: db.Group, attributes: ["name", "description"] },
    });
    if (users) {
      return {
        EM: "Get data success",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "Get data success",
        EC: 0,
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

const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    let { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      limit: limit,
    });
    let totalPages = Math.ceil(count / limit);

    let data = {
      totalRows: count,
      totalPages,
      users: rows,
    };

    return {
      EM: "Get data success",
      EC: 0,
      DT: data,
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

const createNewUser = async (data) => {
  try {
  } catch (e) {
    console.log(e);
    return {
      EM: "Get data error",
      EC: 1,
      DT: [],
    };
  }
};

const updateUser = async (data) => {
  try {
    let user = await db.User.findOne({
      where: { id: data.id },
    });
    if (user) {
      user.save({});
    } else {
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

const deleteUser = async (id) => {
  try {
    await db.User.delete({
      where: { id: id },
    });
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
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
  getUserWithPagination,
};
