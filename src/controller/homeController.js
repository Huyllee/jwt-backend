import userService from "../service/userService";

const handleHomeController = (req, res) => {
  return res.render("home.ejs");
};

const handleUserController = async(req, res) => {
  let dataTable =await userService.getUserList();
  return res.render("user.ejs",{dataTable});
};

const handleCreateUserController = async(req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let userName = req.body.username;

  await userService.createNewUser(email, userName, password);

  return res.redirect("/user");
};

const handleDeleteUserController = async(req, res) => {
  let idUser = req.params.id;
  try{
    await userService.deleteUser(idUser);
    return res.redirect("/user");
  }catch(err){
    console.log(err);
  }
  
}

const handleGetUserByIdController = (req, res) => {}

const handleUpdateUserController = (req, res) => {}

module.exports = {
  handleHomeController,
  handleUserController,
  handleCreateUserController,
  handleDeleteUserController,
  handleGetUserByIdController,
  handleUpdateUserController
};
