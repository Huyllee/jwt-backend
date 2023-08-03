const testApi = (req, res) => {
  return res.status(200).json({
    message: "ok",
    data: "test",
  });
};

const handleRegister = (req, res) => {
  try {
    console.log("run", req.body);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  testApi,
  handleRegister,
};
