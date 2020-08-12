const { users } = require("../../models");
module.exports = {
  post: (req, res) => {
    let { email } = req.body;
    users.findOne({ where: { email } }).then((data) => {
      if (!data) {
        res.status(201).send({ message: "사용가능한 이메일 입니다." });
      } else {
        res.status(409).send({ message: "이미 사용중인 이메일 입니다." });
      }
    });
  },
};
