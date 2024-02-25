import express from "express";
import {
  StartApp,
  StoreList,
  selectStore,
  checkStoreOpen,
  openShop,
  cashIn,
  cashOut,
  setCashDrawer,
  getSummary,
  closeShop,
  getStore,
  setBillOnlineFalse,
} from "../controllers/App.js";
const router = express.Router();
router.get("/StartApp", StartApp);
router.get("/StoreList", StoreList);
router.post("/SelectStore", selectStore);
router.get("/checkStore", checkStoreOpen);
router.get("/printReport", getSummary);
router.post("/closeStore", closeShop);
router.post("/SetCashDrawer", setCashDrawer);
router.post("/OpenStore", openShop);
router.post("/cashIn", cashIn);
router.post("/cashOut", cashOut);
router.get("/store", getStore);
router.get("/setBillOnlineFalse", setBillOnlineFalse);

export default router;
