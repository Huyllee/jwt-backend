import userService from "../service/userService";

const handleHomeController = (req, res) => {
  return res.render("home.ejs");
};

const handleUserController = (req, res) => {
  let userList = userService.getUserList();
  return res.render("user.ejs");
};

const handleCreateUserController = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let userName = req.body.username;

  userService.createNewUser(email, userName, password);

  return res.send("create user");
};

module.exports = {
  handleHomeController,
  handleUserController,
  handleCreateUserController,
};
