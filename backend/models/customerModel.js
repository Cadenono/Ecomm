const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const customerSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    postal_code: { type: String, required: true },
    gender: { type: String },
    admin: { type: Boolean, default: false },
    history: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

customerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("Customer", customerSchema);
