const { users } = require("../../models");
const { tokenGenetator, verification } = require("../../jwt-utils");

module.exports = {
  post: (req, res) => {
    try {
      let { email, password } = req.body;
      users.findOne({ where: { email, password } }).then((data) => {
        if (data) {
          let token = tokenGenetator(data, req);
          res.cookie("user", token);
          res.status(201).send({
            userInfo: {
              username: data.username,
              email: data.email,
              phone: data.phone,
              address: data.address,
              user_type: data.user_type,
              user_admission: data.user_admission,
            },
          });
        } else {
          res
            .status(404)
            .send({ message: "ID나 비밀번호가 일치하지 않습니다." });
        }
      });
    } catch (e) {
      res.status(500).send({ message: e });
    }
  },
};
