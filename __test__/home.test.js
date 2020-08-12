"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

chai.use(chaiHttp);

const app = require("../app");
const { goods } = require("../models");
const { refreshData } = require("./fixtures/index");

describe("Home Contorller API", () => {
  beforeEach(async () => {
    await refreshData();
  });
  describe("GET /home", () => {
    // 일반 회원가입 => user_type이 1인 경우
    it("홈 접속시 시 추천 정보를 응답해야 합니다", (done) => {
      chai
        .request(app)
        .get("/home")
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(201);
          expect(res.body.recommendation).to.be.an("array");
          expect(res.body.recommendation[0]).has.all.keys([
            "id",
            "title",
            "img",
            "contents",
            "filter",
          ]);
          done();
        });
    });
    it("홈 접속시 시 베스트 리스트를 응답해야 합니다", (done) => {
      chai
        .request(app)
        .get("/home")
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(201);
          expect(res.body.best).to.be.an("array");
          expect(res.body.best[0]).has.all.keys([
            "id",
            "title",
            "img",
            "price",
          ]);
          done();
        });
    });
    it("홈 접속시 시 데이터가 없으면 메세지를 응답해야 합니다", (done) => {
      goods.destroy({ where: {} });
      chai
        .request(app)
        .get("/home")
        .end((err, res) => {
          if (err) {
            done(err);
            return;
          }
          expect(res).to.have.status(404);
          expect(res.body.recommendation).to.be.an("undefined");
          expect(res.body.best).to.be.an("undefined");
          expect(res.body.message).to.equal("data is not found");
          done();
        });
    });
  });
});
