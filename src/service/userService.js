import bcrypt from "bcryptjs";
import mysql from "mysql2";
import db from "../models";

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const createNewUser = async (email, userName, password) => {
  let hashPass = hashPassword(password);

  try {
    await db.User.create({
      userName: userName,
      email: email,
      password: hashPass,
    });
  } catch (err) {
    console.log(err);
  }
};

const getUserList = async () => {
  let users = [];
  users = await db.User.findAll();
  return users;
};

const deleteUser = async (userId) => {
  await db.User.destroy({
    where: { id: userId },
  });
};

module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
};
