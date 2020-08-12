const { goods } = require("../../models");

module.exports = {
  post: (req, res) => {
    const { goods_name, goods_price, stock, flower_language } = req.body;
    const token = res.locals.userId;
    let goods_img;
    let infoimg;
    let recommendimg;
    if (req.files) {
      req.files.forEach((val) => {
        if (val.fieldname === "goods_img") {
          goods_img = `http://ec2-15-164-219-204.ap-northeast-2.compute.amazonaws.com:4000/${val.path}`;
        } else if (val.fieldname === "info_img") {
          infoimg = `http://ec2-15-164-219-204.ap-northeast-2.compute.amazonaws.com:4000/${val.path}`;
        } else if (val.fieldname === "recommend_img") {
          recommendimg = `http://ec2-15-164-219-204.ap-northeast-2.compute.amazonaws.com:4000/${val.path}`;
        }
      });
    }

    goods
      .create({
        user_id: token,
        goods_name: goods_name,
        goods_img: goods_img,
        goods_price: goods_price,
        stock: stock,
        info_img: infoimg,
        recommend_img: recommendimg,
        flower_language: flower_language,
      })
      .then(() => {
        res.status(201).send({
          message: "정상적으로 상품이 등록 되었습니다.",
        });
      })
      .catch(() => {
        res.status(404).send({
          message: "상품 등록이 실패 되었습니다.",
        });
      });
  },
};
