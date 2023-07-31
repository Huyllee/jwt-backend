import bcrypt from "bcryptjs";
import mysql from "mysql2";

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "huylee",
  password: "123456",
  database: "jwt",
});

const salt = bcrypt.genSaltSync(10);

const hashPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const createNewUser = (email, userName, password) => {
  let hashPass = hashPassword(password);

  connection.query(
    `INSERT INTO users (userName, email, password)
  VALUES (?, ?, ?)`,
    [userName, email, hashPass],
    function (err, results, fields) {
      if (err) {
        console.log(err);
      } else {
        console.log(results);
      }
    }
  );
};

const getUserList = async () => {
  let users = [];
  //   return connection.query(
  //     `SELECT * FROM users`,
  //     function (err, results, fields) {
  //       if (err) {
  //         console.log(err);
  //         return users;
  //       } else {
  //         users = results;
  //         console.log(results);
  //       }
  //     }
  //   );
};

module.exports = {
  createNewUser,
  getUserList,
};
