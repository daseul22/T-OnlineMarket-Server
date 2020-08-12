const { order_lists } = require("../../models");

module.exports = {
  post: (req, res) => {
    let { order_lists_id } = req.body;
    order_lists
      .findOne({ where: { id: order_lists_id }, attributes: ["order_state"] })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "해당하는 판매내역이 없습니다." });
        } else if (data.order_state !== 2) {
          res.status(404).send({
            message: "배송이 완료되지 않아서 구매확정을 할 수 없습니다.",
          });
        } else {
          order_lists
            .update({ order_state: 3 }, { where: { id: order_lists_id } })
            .then((result) => {
              if (result) {
                res.status(200).send({ message: "구매 확정되었습니다." });
              }
            })
            .catch((e) => {
              res.status(404).send({ message: "구매 확정에 실패하였습니다." });
            });
        }
      });
  },
};
