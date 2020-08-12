const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

chai.use(chaiHttp);

const app = require("../app");
const { order_lists } = require("../models");
const { refreshData } = require("./fixtures/index");

describe("Mypage Test Case", () => {
  beforeEach(async () => {
    await refreshData();
  });

  describe("GET/mypage/purchase", () => {
    it("사용자가 구매한 상품의 목록을 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent.get("/mypage/purchase").end((err, res) => {
            expect(res).to.have.status(200);
            res.body.forEach((value) => {
              expect(value).has.all.keys([
                "order_id",
                "goods_name",
                "goods_img",
                "goods_price",
                "rec_name",
                "rec_address",
                "goods_quantity",
                "order_date",
              ]);
            });
            done();
          });
        });
    });
    it("판매자가 구매한 상품의 목록을 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller2@gmail.com", password: "1234" })
        .then(() => {
          agent.get("/mypage/purchase").end((err, res) => {
            expect(res).to.have.status(200);
            res.body.forEach((value) => {
              expect(value).has.all.keys([
                "order_id",
                "goods_name",
                "goods_img",
                "goods_price",
                "rec_name",
                "rec_address",
                "goods_quantity",
                "order_date",
              ]);
            });
            done();
          });
        });
    });
    it("사용자가 구매한 상품이 없으면 없다고 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer3@gmail.com", password: "1234" })
        .then(() => {
          agent.get("/mypage/purchase").end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal("구매 내역이 없습니다.");
            done();
          });
        });
    });
  });
  describe("GET/mypage/sale", () => {
    it("판매자의 판매 내역을 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller2@gmail.com", password: "1234" })
        .then(() => {
          agent.get("/mypage/sale").end((err, res) => {
            expect(res).to.have.status(200);
            res.body.forEach((value) => {
              expect(value).has.all.keys([
                "order_id",
                "goods_name",
                "goods_img",
                "goods_price",
                "rec_name",
                "rec_address",
                "goods_quantity",
                "order_date",
              ]);
            });
            done();
          });
        });
    });
    it("판매자의 판매 내역이 없으면 없다고 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller4@gmail.com", password: "1234" })
        .then(() => {
          agent.get("/mypage/sale").end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal("판매 내역이 없습니다.");
            done();
          });
        });
    });
  });
  describe("GET/mypage/onsale", () => {
    it("판매자가 등록해 둔 상품 목록을 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller2@gmail.com", password: "1234" })
        .then(() => {
          agent.get("/mypage/onsale").end((err, res) => {
            expect(res).to.have.status(200);
            res.body.forEach((value) => {
              expect(value).has.all.keys([
                "goods_name",
                "goods_img",
                "goods_price",
                "stock",
              ]);
            });
            done();
          });
        });
    });
    it("판매자가 등록해 둔 상품 목록이 없으면 없다고 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller4@gmail.com", password: "1234" })
        .then(() => {
          agent.get("/mypage/onsale").end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.message).to.equal("등록한 상품이 없습니다.");
            done();
          });
        });
    });
  });
  describe("POST/mypage/confirm", () => {
    it("사용자가 구매확정 요청을 보내면 구매확정이 완료되어야 한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/mypage/confirm")
            .send({ order_lists_id: 1 })
            .end((err, res) => {
              order_lists.findOne({ where: { id: 1 } }).then((data) => {
                expect(data.order_state).to.equal(3);
              });
              expect(res).to.have.status(200);
              expect(res.body.message).to.equal("구매 확정되었습니다.");
              done();
            });
        });
    });
    it("배송이 완료되지 않았으면 구매확정이 올바르게 이루어지지 못해야 한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/mypage/confirm")
            .send({ order_lists_id: 2 })
            .end((err, res) => {
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal(
                "배송이 완료되지 않아서 구매확정을 할 수 없습니다."
              );
              done();
            });
        });
    });
    it("주문 목록이 없으면 에러메세지를 응답해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "consumer1@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/mypage/confirm")
            .send({ order_lists_id: 30 })
            .end((err, res) => {
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal(
                "해당하는 판매내역이 없습니다."
              );
              done();
            });
        });
    });
  });

  describe("POST/mypage/orderCheck", () => {
    it("판매자가 배송상황을 입력하면 orderstate를 1로 수정해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller2@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/mypage/orderCheck")
            .send({
              invoice_number: "418173431690",
              delivery_company_id: "05",
              order_lists_id: 3,
            })
            .end((err, res) => {
              order_lists.findOne({ where: { id: 3 } }).then((data) => {
                expect(data.order_state).to.equal(1);
              });
              expect(res).to.have.status(200);
              expect(res.body.message).to.equal("정상적으로 입력 되었습니다.");
              done();
            });
        });
    });
    it("orderstate가 0이 아닌 목록에 대해서는 수정이 불가능해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller3@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/mypage/orderCheck")
            .send({
              invoice_number: "418173431690",
              delivery_company_id: "05",
              order_lists_id: 2,
            })
            .end((err, res) => {
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal(
                "이미 배송이 진행중이거나 완료된 상품입니다."
              );
              done();
            });
        });
    });
    it("송장번호 혹은 택배사 번호가 틀리면 에러메세지를 응답한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller3@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/mypage/orderCheck")
            .send({
              invoice_number: "21323232322",
              delivery_company_id: "99",
              order_lists_id: 4,
            })
            .end((err, res) => {
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal(
                "택배사코드나 송장번호를 제대로 입력해주세요."
              );
              done();
            });
        });
    });
    it("주문 목록이 없으면 에러메세지를 응답해야한다.", (done) => {
      const agent = chai.request.agent(app);
      agent
        .post("/user/login")
        .send({ email: "seller2@gmail.com", password: "1234" })
        .then(() => {
          agent
            .post("/mypage/orderCheck")
            .send({
              invoice_number: "418173431690",
              delivery_company_id: "05",
              order_lists_id: 30,
            })
            .end((err, res) => {
              expect(res).to.have.status(404);
              expect(res.body.message).to.equal(
                "해당하는 판매내역이 없습니다."
              );
              done();
            });
        });
    });
  });
});
