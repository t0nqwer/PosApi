import express from "express";
import {
  StartApp,
  StoreList,
  selectStore,
  checkStoreOpen,
  openShop,
} from "../controllers/App.js";
const router = express.Router();
router.get("/StartApp", StartApp);
router.get("/StoreList", StoreList);
router.post("/SelectStore", selectStore);
router.get("/checkStore", checkStoreOpen);
router.post("/OpenStore", openShop);

export default router;
