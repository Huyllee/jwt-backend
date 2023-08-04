import jwt from "jsonwebtoken";
require("dotenv").config();

const createJWT = () => {
  let payload = { name: "huylee", age: "22" };
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key);
    console.log(token);
  } catch (err) {
    console.log(err);
  }
  return token;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let data = null;

  try {
    data = jwt.verify(token, key);
  } catch (err) {
    console.log(err);
  }
  return data;
};

module.exports = {
  createJWT,
  verifyToken,
};
