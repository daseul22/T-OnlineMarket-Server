const { goods } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  get: async (req, res) => {
    let recommendationData = await goods
      .findAll({
        where: { goods_type: { [Op.or]: ["장미", "나무"] } },
        offset: 0,
        limit: 3,
        order: [["stock"]],
      })
      .then((data) => {
        return data.map((goods) => {
          return {
            img: goods.recommend_img,
            filter: goods.goods_type,
          };
        });
      });
    let bestData = await goods
      .findAll({
        where: {},
        offset: 0,
        limit: 10,
        order: [["stock"]],
      })
      .then((data) => {
        return data.map((goods) => {
          return {
            id: goods.id,
            title: goods.goods_name,
            price: goods.goods_price,
            img: goods.goods_img,
          };
        });
      });
    if (recommendationData.length && bestData.length) {
      res.status(201).send({
        recommendation: recommendationData,
        best: bestData,
      });
    } else {
      res.status(404).send({
        message: "data is not found",
      });
    }
  },
};
