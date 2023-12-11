import Pos from "../models/pos.js";
import AppSetting from "../models/appsetting.js";
import moment from "moment";
import { connectToDatabase } from "./database.js";
import Bill from "../models/bill.js";
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}
function toHoursAndMinutes(totalMinutes) {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
}
export default async function Summary(cashInDrawer) {
  try {
    connectToDatabase();
    const data = await Pos.findOne({ status: "open" });
    if (data === null) throw Error("Store is not open");
    const { cashin, cashout } = data;
    const appSetting = await AppSetting.findOne();
    const day = new Date();
    const billName = data.bills;
    const bills = await Bill.find({
      name: { $in: billName },
    });

    const cashClose =
      data.cashdrawer +
      cashin.map((cash) => +cash.cash).reduce((a, b) => a + b, 0) -
      cashout.map((cash) => +cash.cash).reduce((a, b) => a + b, 0) +
      bills
        .filter((bill) => bill.payment === "credit")
        .reduce((a, b) => a + b.totalPay, 0);
    const returndata = {
      shopName: appSetting.storeName,
      date: moment(data.dateOpen).format("DD/MM/YYYY"),
      OpenTime: moment(data.dateOpen).format("DD/MM/YYYY HH:mm"),
      CloseTime: moment(day).format(" DD/MM/YYYY HH:mm"),
      OpenHour: toHoursAndMinutes(
        moment(day).diff(moment(data.dateOpen), "minutes")
      ),
      billCount: bills.length,
      total: bills.reduce((a, b) => a + b.totalPay, 0),
      clothTotal: "",
      cashTotal: bills
        .filter((bill) => bill.payment === "cash")
        .reduce((a, b) => a + b.totalPay, 0),
      cardTotal: bills
        .filter((bill) => bill.payment === "credit")
        .reduce((a, b) => a + b.totalPay, 0),
      QRTotal: bills
        .filter((bill) => bill.payment === "transfer")
        .reduce((a, b) => a + b.totalPay, 0),
      discountTotal: bills
        .map((bill) => bill.totalBfDiscount - bill.totalPay)
        .reduce((a, b) => a + b, 0),
      cashOpen: data.cashdrawer,
      cashIn: cashin.map((cash) => +cash.cash).reduce((a, b) => a + b, 0),
      cashOut: cashout.map((cash) => +cash.cash).reduce((a, b) => a + b, 0),
      cashClose: cashClose,
      cashInDrawer: cashInDrawer,
      cashInDrawerDiff: cashInDrawer - cashClose,
    };
    return returndata;
  } catch (error) {
    console.log(error.message);
  }
}
