const { users, goods, order_lists } = require("../../models");
const e = require("express");

module.exports = {
  get: (req, res) => {
    let token = res.locals.userId;

    order_lists
      .findAll({
        include: [
          {
            model: goods,
            attributes: ["goods_name", "goods_img", "goods_price"],
          },
        ],
        where: { user_id: token },
      })
      .then((data) => {
        if (data.length !== 0) {
          let arr = [];
          data.forEach((val) => {
            let obj = {
              order_id: val.id,
              goods_name: val.good.goods_name,
              goods_img: val.good.goods_img,
              goods_price: val.good.goods_price * val.goods_quantity,
              rec_name: val.rec_name,
              rec_address: val.rec_address,
              goods_quantity: val.goods_quantity,
              order_date: val.order_date,
            };
            arr.push(obj);
          });
          res.status(200).send(arr);
        } else {
          res.status(404).send({ message: "구매 내역이 없습니다." });
        }
      });
  },
};
