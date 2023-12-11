import Product from "../models/product.js";
import Bill from "../models/bill.js";
import { createBill } from "../function/createBill.js";
import Pos from "../models/pos.js";
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
        const active = await Bill.findOne({ _id: bill._id });
        const products = active.products.map(async (product) => {
          const productdata = await Product.findOne({ _id: product.barcode });
          return {
            ...productdata._doc,
            barcode: product.barcode,
            qty: product.qty,
          };
        });
        const productwithdata = await Promise.all(products);

        return res.json({ ...active._doc, products: productwithdata });
      }
    }
    const currentBill = await Bill.findOne({ name: billName });
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
      const active = await Bill.findOne({ _id: currentBill._id });
      const products = active.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return res.json({ ...active._doc, products: productwithdata });
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
export const AddCustomProduct = async (req, res) => {
  const { billName, name, price, qty } = req.body;
  try {
    console.log(billName, name, price, qty);
    const CustomProduct = {
      name: name,
      qty: 1,
      price: price,
    };
    if (billName === "" || !billName) {
      const bill = await createBill();

      const NewBill = await Bill.updateOne(
        {
          _id: bill._id,
        },

        { $push: { customProducts: CustomProduct } }
      );
      if (NewBill) {
        const active = await Bill.findOne({ _id: bill._id });
        const products = active.products.map(async (product) => {
          const productdata = await Product.findOne({ _id: product.barcode });
          return {
            ...productdata._doc,
            barcode: product.barcode,
            qty: product.qty,
          };
        });
        const productwithdata = await Promise.all(products);

        return res.json({ ...active._doc, products: productwithdata });
      }
    }
    const currentBill = await Bill.findOne({ name: billName });
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      { $push: { customProducts: CustomProduct } }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id });
      const products = active.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return res.json({ ...active._doc, products: productwithdata });
    }
  } catch (error) {}
};
export const DeleteCustomProduct = async (req, res) => {
  const { billName, name } = req.body;
  try {
    const currentBill = await Bill.findOne({ name: billName });
    const products = currentBill.customProducts.filter(
      (product) => product.name !== name
    );
    const updatebill = await Bill.updateOne(
      { _id: currentBill._id },
      {
        $set: {
          customProducts: products,
        },
      }
    );
    if (updatebill) {
      const active = await Bill.findOne({ _id: currentBill._id });
      const products = active.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return res.json({ ...active._doc, products: productwithdata });
    }
  } catch (error) {
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
      const active = await Bill.findOne({ _id: currentBill._id });
      const products = active.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return res.json({ ...active._doc, products: productwithdata });
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const DecreseQty = async (req, res) => {
  const { billName, barcode, pull } = req.body;
  try {
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
      const active = await Bill.findOne({ _id: currentBill._id });
      const products = active.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return res.json({ ...active._doc, products: productwithdata });
    }
  } catch (error) {
    console.log(error.message);
    res.json(error.message);
  }
};
export const DeleteProduct = async (req, res) => {
  const { billName, barcode } = req.body;
  try {
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
      const active = await Bill.findOne({ _id: currentBill._id });
      const products = active.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return res.json({ ...active._doc, products: productwithdata });
    }
  } catch (error) {
    res.json(error.message);
  }
};
export const GetBillList = async (req, res) => {
  try {
    const findBill = await Bill.find({
      active: "active",
    });
    const findBillwithdata = findBill.map(async (bill) => {
      const products = bill.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return {
        ...bill._doc,
        products: productwithdata,
      };
    });
    const billwithdata = await Promise.all(findBillwithdata);

    res.json(billwithdata);
  } catch (error) {
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
      const findBillwithdata = newlist.map(async (bill) => {
        const products = bill.products.map(async (product) => {
          const productdata = await Product.findOne({ _id: product.barcode });
          return {
            ...productdata._doc,
            barcode: product.barcode,
            qty: product.qty,
          };
        });
        const productwithdata = await Promise.all(products);
        return {
          ...bill._doc,
          products: productwithdata,
        };
      });
      const billwithdata = await Promise.all(findBillwithdata);

      return res.json(billwithdata);
    }
  } catch (error) {
    res.json(error.message);
  }
};
export const CreateBill = async (req, res) => {
  try {
    const newbill = await createBill();
    const findBill = await Bill.find({
      active: "active",
    });
    const findBillwithdata = findBill.map(async (bill) => {
      const products = bill.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return {
        ...bill._doc,
        products: productwithdata,
      };
    });
    const billwithdata = await Promise.all(findBillwithdata);
    const pos = await Pos.findOne({ status: "open" });
    const posBill = pos.bills ? [...pos.bills, newbill.name] : [newbill.name];
    await Pos.updateOne({ _id: pos._id }, { bills: posBill });

    res.json({ list: billwithdata, current: newbill });
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
      const products = active.products.map(async (product) => {
        const productdata = await Product.findOne({ _id: product.barcode });
        return {
          ...productdata._doc,
          barcode: product.barcode,
          qty: product.qty,
        };
      });
      const productwithdata = await Promise.all(products);
      return res.json({ ...active._doc, products: productwithdata });
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
export const FinishBill = async (req, res) => {
  const { billName, type, totalBfDiscount, totalPay, cash, change } = req.body;
  try {
    const updatebill = await Bill.updateOne(
      { name: billName },
      {
        payment: type,
        totalBfDiscount,
        active: "purchase",
        totalPay,
        cash,
        change,
      }
    );
    if (updatebill) {
      try {
        const { data } = await axios.post(
          `${process.env.URL}/Bill`,
          updatebill
        );
        await Bill.updateOne({ name: billName }, { IsOnline: true });
        const Billw = await Bill.findOne({ name: billName });
        const pos = await Pos.findOne({ status: "open" });
        const posBill = pos.bills ? [...pos.bills, Billw.name] : [Billw.name];
        await Pos.updateOne({ _id: pos._id }, { bills: posBill });
        res.json(Billw);
      } catch (error) {
        const Billw = await Bill.findOne({ name: billName });
        const pos = await Pos.findOne({ status: "open" });
        const posBill = pos.bills ? [...pos.bills, Billw.name] : [Billw.name];
        await Pos.updateOne({ _id: pos._id }, { bills: posBill });

        res.json(Billw);
      }
    }
  } catch (error) {
    res.json(error.message);
  }
};
