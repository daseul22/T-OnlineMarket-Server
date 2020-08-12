module.exports = {
  post: (req, res) => {
    // req.user = undefined;
    res.cookie("user", undefined);
    res.status(201).send({ message: "로그아웃이 되었습니다." });
  },
};
