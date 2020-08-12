const { users } = require("../../models");

module.exports = {
  post: async (req, res) => {
    try {
      let { email, password } = req.body;
      let userData = await users.findOne({ where: { email, password } });
      if (!userData) {
        res.status(404).send({ message: "비밀번호가 일치하지 않습니다." });
      } else {
        await users.destroy({ where: { id: userData.id } });
        res
          .status(201)
          .send({ message: "회원탈퇴가 정상적으로 완료되었습니다." });
      }
    } catch (e) {
      res.status(500).send("server error");
    }
  },
};
