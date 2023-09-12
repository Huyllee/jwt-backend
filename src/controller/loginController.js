const handleGetLoginPage = (req, res) => {
  return res.render("login.ejs");
};

module.exports = {
  handleGetLoginPage,
};
