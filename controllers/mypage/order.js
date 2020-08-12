const { order_lists } = require("../../models");
module.exports = {
  post: (req, res) => {
    let token = req.locals.userId;
    let {
      goods_id,
      goods_quantity,
      rec_name,
      rec_phone,
      rec_address,
    } = req.body;

    order_lists
      .create({
        user_id: token,
        goods_id,
        goods_quantity,
        rec_name,
        rec_phone,
        rec_address,
      })
      .then((order) => {
        if (order) {
          res.status(200).send({ message: "주문에 성공했습니다." });
        } else {
          res.status(404).send({ message: "주문에 실패했습니다." });
        }
      })
      .catch((e) => {
        res.status(500).send({ message: "서버가 점검중입니다." });
      });
  },
};
