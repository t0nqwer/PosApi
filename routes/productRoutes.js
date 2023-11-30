import express from "express";
import {
  ListProduct,
  AddProduct,
  GetCurrentProductList,
  AddQty,
  DecreseQty,
  DeleteProduct,
  GetBillList,
  DeleteBill,
  CreateBill,
  SetDiscount,
  SetBill,
  AddCustomProduct,
  DeleteCustomProduct,
  FinishBill,
} from "../controllers/Product.js";
const router = express.Router();

router.get("/ListProduct", ListProduct);
router.post("/AddProduct", AddProduct);
router.get("/GetCurrentProductList/:id", GetCurrentProductList);
router.post("/AddQty", AddQty);
router.post("/DecreseQty", DecreseQty);
router.post("/DeleteProduct", DeleteProduct);
router.get("/GetBillList", GetBillList);
router.delete("/DeleteBill/:id", DeleteBill);
router.get("/CreateBill", CreateBill);
router.post("/SetDiscount", SetDiscount);
router.post("/SetBill", SetBill);
router.route("/customProduct").post(AddCustomProduct).put(DeleteCustomProduct);
router.post("/finishBill", FinishBill);
export default router;
