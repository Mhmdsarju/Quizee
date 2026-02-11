import crypto from "crypto";
import userModel from "../models/userModel.js";

export const generateReferralCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = crypto.randomBytes(4).toString("hex").toUpperCase(); 
    exists = await userModel.exists({ referralCode: code });
  }

  return code;
};
