import axios from "axios";
import Product from "../models/product.js";
import Store from "../models/store.js";
import AppSetting from "../models/appsetting.js";
export default async function startServer() {
  try {
    const setting = await AppSetting.findOne();

    const response = await axios.post(`${process.env.URL}/startApp`, {
      name: setting.storeName,
    });
    const product = await Product.find().select("_id");
    const currentProduct = product.map((item) => item._id);
    const newProduct = response.data.data.map((item) => item._id);
    const difference = newProduct.filter((x) => !currentProduct.includes(x));
    const deleteProduct = currentProduct.filter((x) => !newProduct.includes(x));
    const newProductData = response.data.data.filter((item) =>
      difference.includes(item._id)
    );
    console.log(response.data.transfer);
    await Product.deleteMany({ _id: { $in: deleteProduct } });
    await Product.insertMany(newProductData);
    await Store.deleteMany({});
    await Store.insertMany(response.data.stores);
    console.log("helloworld: server started");
  } catch (error) {}
}
