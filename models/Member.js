const mongoose = require("mongoose");
const { Schema } = mongoose;
//member ini di dapat pada saat cust booking(api booking)

const memberSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Member", memberSchema);
