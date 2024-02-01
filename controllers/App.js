import AppSettings from "../models/appsetting.js";
import Store from "../models/store.js";
import Pos from "../models/pos.js";
import axios from "axios";
import Summary from "../function/Summary.js";
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
  console.log(process.env.URL);

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
export const cashIn = async (req, res) => {
  const { cash, note, id } = req.body;
  try {
    const data = await Pos.findByIdAndUpdate(
      id,
      {
        $push: {
          cashin: {
            cash,
            note,
          },
        },
      },
      { new: true }
    );
    if (data === null) throw Error("Store is not open");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const cashOut = async (req, res) => {
  const { cash, note, id } = req.body;

  try {
    const data = await Pos.findByIdAndUpdate(
      id,
      {
        $push: {
          cashout: {
            cash,
            note,
          },
        },
      },
      { new: true }
    );
    if (data === null) throw Error("Store is not open");
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const closeShop = async (req, res) => {
  const { cash } = req.body;
  try {
    const data = await Summary(cash);
    if (data) {
      await Pos.findOneAndUpdate(
        { status: "open" },
        { status: "close", dateClose: new Date() }
      );
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const getSummary = async (req, res) => {
  try {
    const data = await Summary(0);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getCashDrawer = async (req, res) => {
  try {
    const data = await AppSettings.findOne();
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
export const setCashDrawer = async (req, res) => {
  const { cashDrawer } = req.body;
  try {
    console.log(cashDrawer, req.body);
    const data = await AppSettings.findOneAndUpdate(
      {},
      { cashDrawerPath: cashDrawer },
      { new: true }
    );
    res.status(200).json(data);
  } catch (error) {}
};

export const getStore = async (req, res) => {
  try {
    const StoreName = await AppSettings.findOne();
    const data = await Store.findOne({ name: StoreName.storeName });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
