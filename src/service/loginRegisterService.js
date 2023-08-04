import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

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
        return {
          EM: "ok",
          EC: 0,
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

module.exports = {
  registerNewUser,
  loginUser,
};
