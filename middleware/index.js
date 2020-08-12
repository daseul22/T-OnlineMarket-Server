const { reviews, reply, q_lists } = require("../models");

module.exports = {
  reviewMiddleware: (req, res, next) => {
    let { review_id } = req.body;
    let token = res.locals.userId;
    reviews.findOne({ where: { id: review_id } }).then((result) => {
      if (result.user_id === token) {
        next();
      } else {
        res.status(401).send({ message: "작성자만 접근할 수 있습니다." });
      }
    });
  },
  q_listsMiddleware: (req, res, next) => {
    let { qa_list_id } = req.body;
    let token = res.locals.userId;
    q_lists.findOne({ where: { id: qa_list_id } }).then((result) => {
      if (result.user_id === token) {
        next();
      } else {
        res.status(401).send({ message: "작성자만 접근할 수 있습니다." });
      }
    });
  },
  replyMiddleware: (req, res, next) => {
    let { reply_id } = req.body;
    let token = res.locals.userId;
    reply.findOne({ where: { id: reply_id } }).then((result) => {
      if (result.user_id === token) {
        next();
      } else {
        res.status(401).send({ message: "작성자만 접근할 수 있습니다." });
      }
    });
  },
};
