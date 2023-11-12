import AppSettings from "../models/appsetting.js";
import Store from "../models/store.js";
import Pos from "../models/pos.js";
import axios from "axios";
export const StartApp = async (req, res) => {
  try {
    const app = await AppSettings.findOne();
    if (!app) throw new Error("application not found");
    res.status(200).json(app);
  } catch (error) {
    res.status(400).json("application not found");
  }
};
export const StoreList = async (req, res) => {
  try {
    const stores = await Store.find();

    const notExpire = stores.filter(
      (store) => store.closeDate > Date.now() || store.closeDate === null
    );
    res.status(200).json(notExpire);
  } catch (error) {
    console.log(error);
    res.status(500).json("application not found");
  }
};

export const selectStore = async (req, res) => {
  const { name } = req.body;
  console.log(process.env.SERVER_URL);

  try {
    const app = await AppSettings.findOneAndUpdate(
      {},
      { storeName: name },
      { upsert: true, new: true }
    );
    res.status(200).json(name);
  } catch (error) {
    console.log(error.message);
  }
};

export const checkStoreOpen = async (req, res) => {
  try {
    const IsOpen = await Pos.findOne({ status: "open" });
    if (IsOpen === null) throw Error("Store is not open");
    res.status(200).json(IsOpen);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const openShop = async (req, res) => {
  const { cash } = req.body;
  try {
    const data = await Pos.create({
      status: "open",
      dateOpen: new Date(),
      cashdrawer: cash,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
