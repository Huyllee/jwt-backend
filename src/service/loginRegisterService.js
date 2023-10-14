import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { getGroupWithRoles } from "./JWTService";
import { createJWT } from "../middleware/jwtAction";
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const checkEmail = async (email) => {
  let isExistEmail = await db.User.findOne({
    where: { email: email },
  });
  if (isExistEmail) {
    return true;
  }
  return false;
};

const checkPhone = async (phone) => {
  let isExistPhone = await db.User.findOne({
    where: { phone: phone },
  });
  if (isExistPhone) {
    return true;
  }
  return false;
};

const registerNewUser = async (dataUser) => {
  try {
    let isEmailExist = await checkEmail(dataUser.email);
    if (isEmailExist) {
      return {
        EM: "The email is already existed",
        EC: 1,
      };
    }
    let isPhoneExist = await checkPhone(dataUser.phone);
    if (isPhoneExist) {
      return {
        EM: "The phone is already existed",
        EC: 1,
      };
    }
    let hashPass = hashPassword(dataUser.password);
    await db.User.create({
      email: dataUser.email,
      userName: dataUser.username,
      password: hashPass,
      phone: dataUser.phone,
      groupId: 4,
    });

    return {
      EM: "The user is created successfully",
      EC: 0,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Error from service...",
      EC: -2,
    };
  }
};

const checkPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

const loginUser = async (dataUser) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [
          { email: dataUser.valueLogin },
          { phone: dataUser.valueLogin },
        ],
      },
      raw: true,
    });

    if (user) {
      let isCorrectPassword = checkPassword(dataUser.password, user.password);
      if (isCorrectPassword) {
        const code = uuidv4();
        let groupWithRole = await getGroupWithRoles(user);
        // let payload = {
        //   email: user.email,
        //   userName: user.userName,
        //   groupWithRole,
        // };
        // let token = createJWT(payload);
        return {
          EM: "ok",
          EC: 0,
          DT: {
            // access_token: token,
            groupWithRole,
            email: user.email,
            userName: user.userName,
            code,
          },
        };
      } else {
        return {
          EM: "Your email/phone number or password is incorrect",
          EC: 1,
          DT: "",
        };
      }
    }

    return {
      EM: "Your email/phone number or password is incorrect",
      EC: 1,
      DT: "",
    };
  } catch (err) {
    console.log(err);
    return {
      EM: "Error from service...",
      EC: -2,
      DT: "",
    };
  }
};

const updateUserRefreshToken = async (email, token) => {
  try {
    await db.User.update(
      {
        refreshToken: token,
      },
      { where: { email: email.trim() } }
    );
  } catch (err) {
    console.log(err);
    return {
      EM: "Error from service...",
      EC: -2,
      DT: "",
    };
  }
};

const upsertUserSocialMedia = async (type, dataRaw) => {
  try {
    let user = await db.User.findOne({
      where: { email: dataRaw.email, type: type },
      raw: true,
    });
    if (!user) {
      user = await db.User.create({
        email: dataRaw.email,
        userName: dataRaw.userName,
        type,
      });
    }

    return user;
  } catch (err) {
    console.log(err);
    return {
      EM: "Error from service...",
      EC: -1,
      DT: "",
    };
  }
};

const getUserByRefreshToken = async (token) => {
  try {
    let user = await db.User.findOne({
      where: {
        refreshToken: token,
      },
    });

    if (user) {
      let groupWithRole = await getGroupWithRoles(user);
      return {
        email: user.email,
        userName: user.userName,
        groupWithRole: groupWithRole,
      };
    }
    return null;
  } catch (e) {
    console.log(e);
  }
};

const updateUserCode = async (code, email) => {
  try {
    await db.User.update(
      {
        code: code,
      },
      { where: { email: email.trim() } }
    );
  } catch (err) {
    console.log(err);
    return {
      EM: "Error from service...",
      EC: -2,
      DT: "",
    };
  }
};

module.exports = {
  registerNewUser,
  loginUser,
  hashPassword,
  checkEmail,
  checkPhone,
  checkPassword,
  updateUserRefreshToken,
  upsertUserSocialMedia,
  getUserByRefreshToken,
  updateUserCode,
};
