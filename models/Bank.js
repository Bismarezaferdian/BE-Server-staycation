const mongoose = require("mongoose");
const { Schema } = mongoose;

const bankSchema = new Schema({
  nameBank: {
    type: String,
    required: true,
  },
  nomorRekening: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
