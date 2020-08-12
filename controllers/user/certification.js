const { users } = require("../../models");

module.exports = {
  post: (req, res) => {
    let { email, password } = req.body;
    users
      .findOne({
        where: {
          email: email,
          password: password,
        },
      })
      .then((userData) => {
        if (userData) {
          res.status(201).send({
            message: "인증 성공",
          });
        } else {
          res.status(404).send({
            message: "비밀번호가 일치하지 않습니다.",
          });
        }
      });
  },
};
