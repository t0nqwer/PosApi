import Product from "../models/product.js";
import Bill from "../models/bill.js";
import { createBill } from "../function/createBill.js";
export const ListProduct = async (req, res) => {
  const { search } = req.query;
  try {
    const products = await Product.find({
      $or: [
        {
          _id: {
            $regex: search,
            $options: "i",
          },
        },
        {
          design: {
            $regex: search,
            $options: "i",
          },
        },
        {
          fabric: {
            $regex: search,
            $options: "i",
          },
        },
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    });
    console.log(products.length);

    res.json(products);
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const AddProduct = async (req, res) => {
  const { billName, barcode } = req.body;
  try {
    if (billName === "" || !billName) {
      const bill = await createBill();
      const inputProduct = {
        barcode: barcode,
        qty: 1,
      };

      const NewBill = await Bill.updateOne(
        {
          _id: bill._id,
        },
        {
          $push: {
            products: inputProduct,
          },
        }
      );
      if (NewBill) {
        const active = await Bill.findOne({ _id: bill._id }).populate(
          "products"
        );
        return res.json(active);
      }
    }
    const currentBill = await Bill.findOne({ name: billName }).sort({
      date: -1,
    });
    const inputProduct = {
      barcode: barcode,
      qty: 1,
    };
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      {
        $push: {
          products: inputProduct,
        },
      }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id }).populate(
        "products"
      );
      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const GetCurrentProductList = async (req, res) => {
  const { id } = req.params;
  try {
    const currentBill = await Bill.findOne({ _id: id }).select(
      "_id customProducts products"
    );

    const barcodeArr = currentBill.products.map((product) => product.barcode);
    const products = await Product.find({
      _id: {
        $in: barcodeArr,
      },
    });
    const resdata = products.map((product) => {
      const qty = currentBill.products.find((e) => e.barcode === product._id);

      return {
        ...product._doc,
        qty: qty.qty,
      };
    });

    res.json(resdata.concat(currentBill.customProducts));
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const AddQty = async (req, res) => {
  const { billName, barcode } = req.body;
  try {
    const currentBill = await Bill.findOne({ name: billName });
    const products = currentBill.products.map((product) => {
      if (product.barcode === barcode) {
        return {
          ...product,
          qty: product.qty + 1,
        };
      } else {
        return product;
      }
    });
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      {
        $set: {
          products: products,
        },
      }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id }).populate(
        "products"
      );

      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const DecreseQty = async (req, res) => {
  const { billName, barcode, pull } = req.body;
  try {
    console.log(billName, barcode);
    const currentBill = await Bill.findOne({ name: billName });
    const products = currentBill.products
      .map((product) => {
        if (product.barcode === barcode) {
          return {
            ...product,
            qty: product.qty - 1,
          };
        } else {
          return product;
        }
      })
      .filter((product) => product.qty !== 0);
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      {
        $set: {
          products: products,
        },
      }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id }).populate(
        "products"
      );
      console.log(active.products);
      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const DeleteProduct = async (req, res) => {
  const { billName, barcode } = req.body;
  try {
    console.log(billName, barcode);
    const currentBill = await Bill.findOne({ name: billName });
    const products = currentBill.products.filter(
      (product) => product.barcode !== barcode
    );
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      {
        $set: {
          products: products,
        },
      }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id }).populate(
        "products"
      );
      console.log(active.products);
      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const GetBillList = async (req, res) => {
  try {
    const findBill = await Bill.find({
      active: "active",
    });

    res.json(findBill);
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};

export const DeleteBill = async (req, res) => {
  const { id } = req.params;
  try {
    const setdelete = await Bill.updateOne({ _id: id }, { active: "delete" });
    if (setdelete) {
      const newlist = await Bill.find({
        active: "active",
      });
      return res.json(newlist);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const CreateBill = async (req, res) => {
  try {
    const newbill = await createBill();
    console.log(newbill);
    res.json(newbill);
  } catch (error) {
    res.json(error.message);
  }
};
export const SetDiscount = async (req, res) => {
  const { billName, type, amount } = req.body;
  try {
    const currentBill = await Bill.findOne({ name: billName });
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      { distype: type, amount: +amount }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id });
      res.json(active);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const SetBill = async (req, res) => {
  const { billID, payment, cash, total, disamout, change } = req.body;
  try {
    console.log(billID, payment, cash);
    const SetBill = await Bill.findOneAndUpdate(
      {
        _id: billID,
      },
      {
        payment,
        active: "purchase",
        cash: cash,
        total,
        disamout,
        change,
      }
    );

    if (SetBill) {
      console.log(SetBill);
      const findBill = await Bill.find({
        active: "active",
      });
      res.json(findBill);
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
