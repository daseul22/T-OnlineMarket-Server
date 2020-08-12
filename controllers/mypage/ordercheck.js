const { order_lists } = require("../../models");
const axios = require("axios");
const { TRACKING_KEY } = require("../../config/config");
module.exports = {
  post: (req, res) => {
    const { order_lists_id, invoice_number, delivery_company_id } = req.body;

    order_lists
      .findOne({
        where: order_lists_id,
      })
      .then((orderData) => {
        if (orderData) {
          if (orderData.order_state === 0) {
            axios
              .get(
                `https://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${TRACKING_KEY}&t_code=${delivery_company_id}&t_invoice=${invoice_number}`
              )
              .then((trackingData) => {
                if (trackingData.data.msg) {
                  res.status(404).send({
                    message: "택배사코드나 송장번호를 제대로 입력해주세요.",
                  });
                } else {
                  order_lists
                    .update(
                      {
                        invoice_number: invoice_number,
                        delivery_company_id: delivery_company_id,
                        order_state: 1,
                      },
                      { where: { id: order_lists_id } }
                    )
                    .then(() => {
                      res.status(200).send({
                        message: "정상적으로 입력 되었습니다.",
                      });
                    });
                }
              });
          } else {
            res.status(404).send({
              message: "이미 배송이 진행중이거나 완료된 상품입니다.",
            });
          }
        } else {
          res.status(404).send({
            message: "해당하는 판매내역이 없습니다.",
          });
        }
      });
  },
};
