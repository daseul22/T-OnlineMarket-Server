const { reviews, users } = require("../../models");

const url = require("url");
module.exports = {
  get: (req, res) => {
    let { goods_id } = url.parse(req.url, true).query;
    reviews
      .findAll({
        include: [{ model: users, attributes: ["username"] }],
        where: { goods_id: goods_id },
        order: [["id", "desc"]],
      })
      .then((data) => {
        if (data.length !== 0) {
          let arr = [];
          data.forEach((val) => {
            arr.push({
              id: val.id,
              title: val.title,
              username: val.user.username,
              contents: val.contents,
              star: val.star,
              review_img: val.review_img,
            });
          });
          res.status(200).send(arr);
        } else {
          res.status(404).send({ message: "리뷰가 존재하지 않습니다." });
        }
      });
  },
  post: (req, res) => {
    let { review_img, title, contents, star, goods_id } = req.body;
    let token = res.locals.userId;
    let img;
    if (req.files) {
      req.files.forEach((val) => {
        if (val.fieldname === "review_img") {
          img = `http://ec2-15-164-219-204.ap-northeast-2.compute.amazonaws.com:4000/${val.path}`;
        }
      });
    }

    reviews
      .create({
        user_id: token,
        goods_id: goods_id,
        title: title,
        contents: contents,
        star: star,
        review_img: img,
      })
      .then((review) => {
        users.findOne({ where: { id: review.user_id } }).then((user) => {
          res.status(201).send({
            username: user.username,
            title: review.title,
            contents: review.contents,
            star: review.star,
            review_img: review.img,
            createdAt: review.createdAt,
          });
        });
      })
      .catch(() => {
        res.status(404).send({
          message: "글 작성이 실패하였습니다.",
        });
      });
  },
  put: (req, res) => {
    let { review_id, title, contents, star, review_img } = req.body;
    reviews
      .findOne({ where: { id: review_id } })
      .then((data) => {
        let check = false;
        let array = [title, contents, star, review_img];
        array.forEach((val) => {
          if (data.dataValues[val] !== val) {
            check = true;
          }
        });
        return check;
      })
      .then((check) => {
        if (check) {
          reviews
            .update(
              { title, contents, star, review_img },
              { where: { id: review_id } }
            )
            .then((result) => {
              if (result) {
                res.status(200).send({ message: "리뷰 업데이트 성공" });
              }
            })
            .catch((err) => {
              res.status(404).send({ message: "업데이트 실패" });
            });
        } else {
          res.status(404).send({ message: "리뷰 내용이 같습니다." });
        }
      });
  },
  delete: (req, res) => {
    let { review_id } = req.body;
    reviews
      .destroy({ where: { id: review_id } })
      .then((result) => {
        if (result) {
          res.status(200).send({ message: "리뷰 삭제 성공" });
        } else {
          res.status(404).send({ message: "존재하지 않는 review_id 입니다." });
        }
      })
      .catch((e) => {
        res.status(404).send({ message: "삭제 실패" });
      });
  },
};
