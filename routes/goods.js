const express = require("express");
const router = express.Router();
const { goodsController } = require("../controllers/index");
const { jwtVerification } = require("../jwt-utils/index");
const {
  replyMiddleware,
  reviewMiddleware,
  q_listsMiddleware,
} = require("../middleware/index");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "goods_img") {
      cb(null, "images/goods_img");
    } else if (file.fieldname === "info_img") {
      cb(null, "images/info_img");
    } else if (file.fieldname === "review_img") {
      cb(null, "images/review_img");
    } else if (file.fieldname === "recommend_img") {
      cb(null, "images/recommend_img");
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/list", goodsController.list.get);
router.get("/info", goodsController.info.get);
router.get("/info/qa_lists", goodsController.qaLists.get);
router.get("/info/review", goodsController.review.get);
router.post("/info/qa_lists", jwtVerification, goodsController.qaLists.post);
router.post("/info/reply", jwtVerification, goodsController.reply.post);
router.post(
  "/info/review",
  jwtVerification,
  upload.any(),
  goodsController.review.post
);
router.post(
  "/registration",
  jwtVerification,
  upload.any(),
  goodsController.registration.post
);
router.put(
  "/info/qa_lists",
  jwtVerification,
  q_listsMiddleware,
  goodsController.qaLists.put
);
router.put(
  "/info/reply",
  jwtVerification,
  replyMiddleware,
  goodsController.reply.put
);
router.put(
  "/info/review",
  jwtVerification,
  reviewMiddleware,
  goodsController.review.put
);
router.delete(
  "/info/qa_lists",
  jwtVerification,
  q_listsMiddleware,
  goodsController.qaLists.delete
);
router.delete(
  "/info/reply",
  jwtVerification,
  replyMiddleware,
  goodsController.reply.delete
);
router.delete(
  "/info/review",
  jwtVerification,
  reviewMiddleware,
  goodsController.review.delete
);

module.exports = router;
