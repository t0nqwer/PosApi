import AppSetting from "../models/appsetting.js";
import Bill from "../models/bill.js";
import axios from "axios";
import { scheduleJob } from "node-schedule";

const BillOnline = async () => {
  console.log("BillOnline");
  const appSetting = await AppSetting.findOne();
  const BillData = await Bill.find({
    $and: [{ IsOnline: false }, { IsBillFinish: true }],
  });

  for (let i = 0; i < BillData.length; i++) {
    try {
      const bill = BillData[i];
      // console.log({
      //   ...bill._doc,
      //   storeName: appSetting.storeName,
      // });
      const { data } = await axios.post(`${process.env.URL}/saleBill`, {
        ...bill._doc,
        storeName: appSetting.storeName,
      });

      if (data) {
        await Bill.findByIdAndUpdate(bill._id, { IsOnline: true });
      }
    } catch (error) {
      // console.log(error);
      // console.log(error.message);
      break;
    }
  }
};

scheduleJob("*/1 * * * *", () => {
  BillOnline();
});
