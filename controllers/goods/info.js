const { goods } = require("../../models");
module.exports = {
  get: async (req, res) => {
    const { goods_id } = req.query;

    goods
      .findOne({
        where: { id: goods_id },
        attributes: [
          "goods_name",
          "goods_img",
          "goods_price",
          "info_img",
          "flower_language",
        ],
      })
      .then((goodsInfo) => {
        if (goodsInfo) {
          res.status(200).send(goodsInfo);
        } else {
          res.status(404).send({
            message: "해당 제품 정보가 없습니다.",
          });
        }
      });
  },
};
