const { users, q_lists, reply } = require("../../models");
const url = require("url");

module.exports = {
  get: async (req, res) => {
    const { goods_id } = url.parse(req.url, true).query;

    let qLists = await q_lists
      .findAll({
        include: [
          {
            model: users,
            attributes: ["username"],
          },
        ],
        where: {
          goods_id: goods_id,
        },
        attributes: ["id", "title", "contents"],
      })
      .then((qListsData) => {
        if (qListsData.length === 0) {
          res.status(404).send({
            message: "질문이 존재하지 않습니다.",
          });
        } else {
          let joinQLists = qListsData.map((qData) => {
            return {
              id: qData.id,
              title: qData.title,
              username: qData.user.username,
              contents: qData.contents,
            };
          });
          return joinQLists;
        }
      });
    if (qLists) {
      let formmattedQList = [];
      for (let i = 0; i < qLists.length; i++) {
        let replies = await reply
          .findAll({
            include: [
              {
                model: users,
                attributes: ["username"],
              },
            ],
            where: {
              q_lists_id: qLists[i].id,
            },
            attributes: ["id", "text", "createdAt"],
            order: [["id", "desc"]],
          })
          .then((replyData) => {
            let joinReply = replyData.map((reply) => {
              return {
                id: reply.id,
                username: reply.user.username,
                text: reply.text,
                createdAt: reply.createdAt,
              };
            });
            return joinReply;
          });
        formmattedQList.push({
          id: qLists[i].id,
          title: qLists[i].title,
          username: qLists[i].username,
          contents: qLists[i].contents,
          reply: replies,
        });
      }

      res.status(200).send(formmattedQList);
    }
  },
  post: (req, res) => {
    const { goods_id, title, contents } = req.body;
    const token = res.locals.userId;
    if (title && contents) {
      q_lists
        .create({
          user_id: token,
          goods_id: goods_id,
          title: title,
          contents: contents,
        })
        .then((q) => {
          users.findOne({ where: { id: token } }).then(({ username }) => {
            res.status(201).send({
              goods_id: goods_id,
              username: username,
              title: title,
              contents: contents,
              createdAt: q.createdAt,
            });
          });
        });
    } else {
      res.status(404).send({
        message: "내용이 없습니다.",
      });
    }
  },
  put: (req, res) => {
    const { qa_list_id, title, contents } = req.body;

    q_lists
      .findOne({ where: { id: qa_list_id, title: title, contents: contents } })
      .then((qListDatum) => {
        if (qListDatum) {
          res.status(404).send({
            message: "QA 내용이 같습니다.",
          });
        } else {
          q_lists
            .update(
              { title: title, contents: contents },
              { where: { id: qa_list_id } }
            )
            .then(() => {
              res.status(200).send({
                message: "QA 업데이트 성공",
              });
            });
        }
      });
  },
  delete: (req, res) => {
    const { qa_list_id } = req.body;
    console.log(qa_list_id);

    q_lists
      .update(
        { title: "", contents: "삭제된 게시물 입니다." },
        { where: { id: qa_list_id } }
      )
      .then(([isUpdate]) => {
        if (isUpdate) {
          res.status(200).send({
            message: "QA 삭제 성공",
          });
        } else {
          res.status(404).send({
            message: "존재하지 않는 qa_list_id 입니다.",
          });
        }
      })
      .catch((e) => {
        res.status(500).send({ message: "서버가 점검중입니다." });
      });
  },
};
