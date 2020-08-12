const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

chai.use(chaiHttp);

const app = require("../app");
const { q_lists, reply, reviews, goods } = require("../models");
const { refreshData } = require("./fixtures/index");

describe("Goods Test Case", () => {
  beforeEach(async () => {
    await refreshData();
    // await truncateData(goods, goodsFixture);
  });

  describe("GET/goods/list", () => {
    it("검색 요청 시 조건이 없으면 모든 제품의 목록을 응답해야 합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/list")
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          res.body.forEach((data_val, index) => {
            expect(data_val).has.all.keys([
              "goods_id",
              "goods_name",
              "goods_type",
              "goods_img",
              "goods_price",
            ]);
          });
          done();
        });
    });
    it("검색 요청 시 조건에 맞는 제품의 목록을 응답해야 합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/list")
        .query({ min: 1000, max: 50000 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          res.body.forEach((data_val, index) => {
            expect(data_val).has.all.keys([
              "goods_id",
              "goods_name",
              "goods_type",
              "goods_img",
              "goods_price",
            ]);
          });
          done();
        });
    });
    it("검색 요청 시 조건에 맞는 제품이 존재하지 않을 경우 없다는 메세지를 응답해야 합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/list")
        .query({ min: 50000 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal("검색 결과가 없습니다.");
          done();
        });
    });
  });
  describe("GET/goods/info", () => {
    it("특정 제품의 상세정보를 응답해야 합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/info")
        .query({ goods_id: 1 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }

          expect(res).to.have.status(200);
          expect(res.body).has.all.keys([
            "goods_name",
            "goods_img",
            "goods_price",
            "info_img",
          ]);

          done();
        });
    });

    it("해당 정보가 없으면 제품이 없다는 응답을 해야합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/info")
        .query({ goods_id: 11 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal("해당 제품 정보가 없습니다.");

          done();
        });
    });
  });
  describe("GET/goods/info/qa_lists", () => {
    it("해당 제품과 관련된 질문의 목록을 응답해야 합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/info/qa_lists")
        .query({ goods_id: 1 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          res.body.forEach((data_val, index) => {
            expect(data_val).has.all.keys([
              "id",
              "title",
              "username",
              "contents",
              "reply",
            ]);
          });
          done();
        });
    });
    it("해당 제품과 관련된 질문이 없을 경우 없다는 응답을 해야합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/info/qa_lists")
        .query({ goods_id: 2 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal("질문이 존재하지 않습니다.");

          done();
        });
    });
  });
  describe("POST/goods/info/qa_lists", () => {
    it("해당 제품과 관련된 질문이 요청으로 오면 데이터베이스에 저장해야 합니다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/goods/info/qa_lists")
            .send({ title: "hello", contents: "it's awesome", goods_id: 2 })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              q_lists
                .findOne({
                  where: {
                    title: "hello",
                    contents: "it's awesome",
                    goods_id: 2,
                  },
                })
                .then((data) => {
                  if (data) {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal(
                      "성공적으로 글이 작성 되었습니다."
                    );
                  }
                });
              done();
            });
        });
    });
    it("질문에 text가 없을 경우 에러메세지를 응답해야합니다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/goods/info/qa_lists")
            .send({
              title: "hello",
              goods_id: 1,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal("내용이 없습니다.");
              done();
            });
        });
    });
  });
  describe("PUT/goods/info/qa_lists", () => {
    it("q_lists를 업데이트하면 데이터를 수정해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .put("/goods/info/qa_lists")
            .send({
              title: "update",
              contents: "this is updated data",
              qa_list_id: 1,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              q_lists
                .findOne({
                  where: {
                    title: "update",
                    contents: "this is updated data",
                    id: 1,
                  },
                })
                .then((data) => {
                  if (data) {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equal("QA 업데이트 성공");
                  }
                });
              done();
            });
        });
    });
    it("내용이 동일하면 에러메세지를 응답해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .put("/goods/info/qa_lists")
            .send({
              title: "질문합니다",
              contents: "조화인가요? 생화인가요?",
              qa_list_id: 1,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }

              expect(res).to.have.status(404);
              expect(res.body.message).to.equal("QA 내용이 같습니다.");

              done();
            });
        });
    });
  });
  describe("DELETE/goods/info/qa_lists", () => {
    it("질문 삭제 요청 시 데이터를 삭제해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .delete("/goods/info/qa_lists")
            .send({
              qa_list_id: 2,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              q_lists.findOne({ where: { id: 2 } }).then((data) => {
                expect(data.title).to.equal("");
                expect(data.contents).to.equal("삭제된 게시물 입니다.");
              });

              expect(res).to.have.status(200);
              expect(res.body.message).to.equal("QA 삭제 성공");

              done();
            });
        });
    });
    it("존재하지 않는 질문을 삭제 요청 시 에러메세지를 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .delete("/goods/info/qa_lists")
            .send({
              qa_list_id: 40,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }

              expect(res).to.have.status(404);
              expect(res.body.message).to.equal(
                "존재하지 않는 qa_list_id 입니다."
              );

              done();
            });
        });
    });
  });
  describe("POST/goods/info/reply", () => {
    it("질문에 대한 리플이 요청으로 오면 데이터베이스에 저장해야 합니다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/goods/info/reply")
            .send({ text: "yes!", qa_list_id: 1 })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              reply
                .findOne({
                  where: {
                    text: "yes!",
                    q_lists_id: 1,
                  },
                })
                .then((data) => {
                  if (data) {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal("리플 성공");
                  }
                });
              done();
            });
        });
    });
    it("질문에 text가 없을 경우 에러메세지를 응답해야합니다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/goods/info/reply")
            .send({ qa_list_id: 1 })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal("리플 실패");
              done();
            });
        });
    });
  });
  describe("PUT/goods/info/reply", () => {
    it("리플 업데이트 요청 시 데이터를 수정해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .put("/goods/info/reply")
            .send({
              text: "몰라몰라몰라",
              reply_id: 7,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              reply
                .findOne({
                  where: {
                    id: 7,
                    text: "몰라몰라몰라",
                  },
                })
                .then((data) => {
                  if (data) {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equal("리플 업데이트 성공");
                  }
                });
              done();
            });
        });
    });
    it("내용이 동일하면 에러메세지를 응답해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .put("/goods/info/reply")
            .send({
              text: "오래보아야 이쁘다",
              reply_id: 7,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }

              expect(res).to.have.status(404);
              expect(res.body.message).to.equal("리플 내용이 같습니다.");

              done();
            });
        });
    });
  });
  describe("DELETE/goods/info/reply", () => {
    it("리플 삭제 요청 시 데이터를 삭제해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .delete("/goods/info/reply")
            .send({
              reply_id: 7,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              reply.findOne({ where: { id: 7 } }).then((data) => {
                expect(data).to.equal(null);
              });

              expect(res).to.have.status(200);
              expect(res.body.message).to.equal("리플 삭제 성공");

              done();
            });
        });
    });
    it("존재하지 않는 리플을 삭제 요청 시 에러메세지를 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .delete("/goods/info/reply")
            .send({
              reply_id: 40,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }

              expect(res).to.have.status(404);
              expect(res.body.message).to.equal(
                "존재하지 않는 reply_id 입니다."
              );

              done();
            });
        });
    });
  });
  describe("GET/goods/info/review", () => {
    it("해당 제품과 관련된 리뷰를 응답해야 합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/info/review")
        .query({ goods_id: 1 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(200);
          res.body.forEach((data_val, index) => {
            expect(data_val).has.all.keys([
              "title",
              "username",
              "contents",
              "star",
              "review_img",
            ]);
          });
          done();
        });
    });
    it("해당 제품과 관련된 리뷰가 없을 경우 없다는 응답을 해야합니다.", (done) => {
      chai
        .request(app)
        .get("/goods/info/review")
        .query({ goods_id: 8 })
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal("리뷰가 존재하지 않습니다.");

          done();
        });
    });
  });
  describe("POST/goods/info/review", () => {
    it("리뷰가 요청으로 오면 데이터베이스에 저장해야 합니다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/goods/info/review")
            .send({
              goods_id: 1,
              title: "hello",
              contents: "It is good bro!",
              star: 4,
              review_img: "file",
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              reviews
                .findOne({
                  where: {
                    title: "hello",
                    contents: "It is good bro!",
                    star: 4,
                    review_img: "file",
                  },
                })
                .then((data) => {
                  if (data) {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal(
                      "성공적으로 글이 작성 되었습니다."
                    );
                    done();
                  }
                });
            });
        });
    });
    it("리뷰에 text가 없을 경우 에러메세지를 응답해야합니다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/goods/info/review")
            .send({
              title: [2332, 232324],
              star: [12, 4343, 3232],

              review_img: "file",
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal("글 작성이 실패하였습니다.");
              done();
            });
        });
    });
  });
  describe("PUT/goods/info/review", () => {
    it("리뷰 업데이트 요청 시 데이터를 수정해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .put("/goods/info/review")
            .send({
              review_id: 1,
              title: "hello",
              contents: "It is good bro!",
              star: 3,
              review_img: "file",
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              reviews
                .findOne({
                  where: {
                    id: 1,
                    title: "hello",
                    contents: "It is good bro!",
                    star: 3,
                    review_img: "file",
                  },
                })
                .then((data) => {
                  if (data) {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal("리뷰 업데이트 성공.");
                  }
                });
              done();
            });
        });
    });
    it("내용이 동일하면 에러메세지를 응답해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .put("/goods/info/review")
            .send({
              review_id: 1,
              title: "추천합니다",
              contents: "이 제품 너무 좋아요",
              star: 4,
              review_img:
                "https://thumbnail6.coupangcdn.com/thumbnails/remote/230x230ex/image/vendor_inventory/6ce8/9f69b6c2f69e6daa7c28688a214be687d877f9239d3aaf30653db023ed6b.jpg",
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }

              expect(res).to.have.status(404);
              expect(res.body.message).to.equal("리뷰 내용이 같습니다.");

              done();
            });
        });
    });
  });
  describe("DELETE/goods/info/review", () => {
    it("리플 삭제 요청 시 데이터를 삭제해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .delete("/goods/info/review")
            .send({
              review_id: 1,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              reviews.findOne({ where: { id: 1 } }).then((data) => {
                expect(data).to.equal(null);
              });

              expect(res).to.have.status(200);
              expect(res.body.message).to.equal("리뷰 삭제 성공");

              done();
            });
        });
    });
    it("존재하지 않는 리뷰를 삭제 요청 시 에러메세지를 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .delete("/goods/info/review")
            .send({
              review_id: 40,
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }

              expect(res).to.have.status(404);
              expect(res.body.message).to.equal(
                "존재하지 않는 review_id 입니다."
              );

              done();
            });
        });
    });
  });
  describe("POST/goods/registration", () => {
    it("판매자가 상품을 저장하면 데이터베이스에 저장해야 합니다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller2@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/goods/registration")
            .send({
              goods_name: "freesia",
              goods_img: JSON.stringify(["file", "file", "file"]),
              goods_price: 13000,
              stock: 20,
              info_img: "file",
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              goods
                .findOne({
                  where: {
                    goods_name: "freesia",

                    goods_price: 13000,
                    stock: 20,
                    info_img: "file",
                  },
                })
                .then((data) => {
                  if (data) {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal(
                      "정상적으로 상품이 등록 되었습니다."
                    );
                    done();
                  }
                });
            });
        });
    });
    it("상품 등록에 실패했을 경우 에러메세지를 응답해야합니다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller2@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/goods/registration")
            .send({
              goods_name: ["freesia"],
              goods_price: [13000, "23232"],
              stock: [23, 23],
              info_img: "file",
            })
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal("상품 등록이 실패 되었습니다.");
              done();
            });
        });
    });
  });
});
