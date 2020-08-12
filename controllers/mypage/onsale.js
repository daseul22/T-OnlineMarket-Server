const { users, goods } = require("../../models");
module.exports = {
  get: (req, res) => {
    const token = res.locals.userId;

    goods
      .findAll({
        where: {
          user_id: token,
        },
        attributes: ["goods_name", "goods_img", "goods_price", "stock"],
      })
      .then((onSaleData) => {
        if (onSaleData.length !== 0) {
          res.status(200).send(onSaleData);
        } else {
          res.status(404).send({
            message: "등록한 상품이 없습니다.",
          });
        }
      });
  },
};
