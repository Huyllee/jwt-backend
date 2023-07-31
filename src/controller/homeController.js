const handleHomeController = (req, res) => {
  return res.render("home.ejs");
};

const handleUserController = (req, res) => {
  return res.render("user.ejs");
};

const handleCreateUserController = (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let userName = req.body.username;

  console.log("check", req.body);
  return res.send("create user");
};

module.exports = {
  handleHomeController,
  handleUserController,
  handleCreateUserController,
};
