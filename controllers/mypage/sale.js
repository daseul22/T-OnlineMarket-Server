const { goods, order_lists } = require("../../models");

module.exports = {
  get: async (req, res) => {
    let token = res.locals.userId;

    let data = await goods.findAll({
      where: { user_id: token },
      attributes: ["id", "goods_name", "goods_img", "goods_price"],
      include: [
        {
          model: order_lists,
          attributes: [
            "id",
            "rec_name",
            "rec_address",
            "goods_quantity",
            "order_date",
          ],
        },
      ],
    });

    if (data.length !== 0) {
      let resultArray = [];
      data.forEach((val) => {
        if (val.order_lists.length !== 0) {
          val.order_lists.forEach((order) => {
            resultArray.push({
              order_id: order.id,
              goods_name: val.goods_name,
              goods_img: val.goods_img,
              goods_price: val.goods_price * order.goods_quantity,
              rec_name: order.rec_name,
              rec_address: order.rec_address,
              goods_quantity: order.goods_quantity,
              order_date: order.order_date,
            });
          });
        }
      });

      res.status(200).send(resultArray);
    } else {
      res.status(404).send({ message: "판매 내역이 없습니다." });
    }
  },
};
