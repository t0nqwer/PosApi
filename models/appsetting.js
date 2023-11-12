import { Schema, model } from "mongoose";

const appSettingsSchema = new Schema({
  storeName: { type: "string" },
  cashDrawerPath: { type: "string" },
  printer: { type: "string" },
});

const AppSetting = model("AppSetting", appSettingsSchema);
export default AppSetting;
