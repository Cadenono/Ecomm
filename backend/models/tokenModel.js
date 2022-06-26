const mongoose = require("mongoose");
const tokenSchema = mongoose.Schema(
  {
    token: { type: String, required: true },
    //other fields are all encoded in the token, no need to bring them in
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);
