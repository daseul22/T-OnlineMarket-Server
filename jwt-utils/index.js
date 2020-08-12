const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

module.exports = {
  tokenGenetator: ({ id, email, username }, { hostname }) => {
    //토큰을 생성하는 코드
    let token = jwt.sign({ id, email, username, hostname }, secret.tomKey, {
      expiresIn: "2h",
    });
    return token;
  },
  jwtVerification: (req, res, next) => {
    try {
      let token = req.cookies.user;
      if (token === "undefined" || !token) {
        res.status(401).send({ message: "로그인이 필요한 서비스입니다." });
      } else {
        let verify = jwt.verify(token, secret.tomKey);
        if (verify) {
          res.locals.userId = verify.id;
          next();
        } else {
          res.status(401).send({ message: "인증이 되지 않았습니다." });
        }
      }
    } catch (e) {
      res.status(401).send({ message: "토큰이 만료되었습니다." });
    }
  },
};
