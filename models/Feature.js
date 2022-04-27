const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const featureSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  itemId: {
    type: ObjectId,
    ref: "Item",
  },
});

module.exports = mongoose.model("Feature", featureSchema);
