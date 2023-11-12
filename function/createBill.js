import Bill from "../models/bill.js";
import moment from "moment-timezone";
function makeid(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const createBill = async () => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  console.log(moment().tz("Asia/Bangkok").format("YYMMDD"));
  console.log(now);
  let id;
  for (let i = 0; i <= 0; i++) {
    const generateId = makeid(3);
    id = `${moment().tz("Asia/Bangkok").format("YYMMDD")}${generateId}`;
    console.log(id);
    const checkid = await Bill.findOne({ name: id });
    console.log(checkid, "checkid");
    if (!checkid) break;
    console.log("id is exist");
  }
  console.log(id);
  const newBill = new Bill({
    name: id,
    date: moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss"),
  });
  const saveBill = await newBill.save();
  return saveBill;
};
