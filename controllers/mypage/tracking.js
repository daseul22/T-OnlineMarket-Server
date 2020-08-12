const { order_lists } = require("../../models");
const axios = require("axios");
const { TRACKING_KEY } = require("../../config/config");
module.exports = {
  get: async (req, res) => {
    const token = res.locals.userId;

    //======================================
    let deliveryData = await order_lists.findAll({
      where: { user_id: token },
      attributes: [
        "id",
        "delivery_company_id",
        "invoice_number",
        "order_state",
      ],
    });
    let trackingInfo = {};
    let errMsg;
    for (let i = 0; i < deliveryData.length; i++) {
      let {
        id,
        order_state,
        delivery_company_id,
        invoice_number,
      } = deliveryData[i];
      if (order_state === 1 || order_state === 2) {
        let trackingData = (
          await axios.get(
            `https://info.sweettracker.co.kr/api/v1/trackingInfo?t_key=${TRACKING_KEY}&t_code=${delivery_company_id}&t_invoice=${invoice_number}`
          )
        ).data;
        let lastIndex = trackingData.trackingDetails.length;
        if (trackingData.trackingDetails[lastIndex - 1].kind === "배송완료") {
          await order_lists.update(
            {
              order_state: 2,
            },
            {
              where: {
                id: id,
              },
            }
          );
          order_state = 2;
        }

        errMsg = trackingData.msg;
        trackingInfo[id] = {
          order_state: order_state,
          delivery_code: delivery_company_id,
          invoiceNo: invoice_number,
          trackingDetails: trackingData.trackingDetails,
        };
      }
    }

    if (errMsg) {
      res.status(404).send({
        message: errMsg,
      });
    } else {
      res.status(200).send(trackingInfo);
    }
  },
};
