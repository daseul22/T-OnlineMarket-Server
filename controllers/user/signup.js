const { users } = require("../../models");

module.exports = {
  post: (req, res) => {
    //회원가입 정보들이 올바르게 입력 되었는지 확인
    //작성되지 않은 정보가 있을 경우 404 에러 발생
    let array = [
      "username",
      "email",
      "password",
      "phone",
      "address",
      "user_type",
    ];
    let vertification = array.map(el => {
      return Object.keys(req.body).includes(el);
    });

    if (vertification.includes(false)) {
      res.status(404).send({ message: "회원 정보가 올바르지 않습니다." });
    } else {
      let {
        username,
        email,
        password,
        phone,
        address,
        trade_name,
        business_number,
        user_type,
      } = req.body;

      if (user_type === 1) {
        user_admission = 1;
      } else if (user_type === 2) {
        user_admission = 0;
      }

      users
        .findOrCreate({
          where: { email },
          defaults: {
            username,
            password,
            phone,
            address,
            trade_name,
            business_number,
            user_type,
            user_admission,
          },
        })
        .then(([users, created]) => {
          if (created) {
            if (users.user_type === 1) {
              res.status(201).send({ message: "회원가입 성공" });
            } else {
              res
                .status(201)
                .send({ message: "관리자의 승인을 받은 후 가입이 완료됩니다" });
            }
          } else {
            res.status(404).send({ message: "회원 정보가 올바르지 않습니다." });
          }
        });
    }
  },
};
