const mongoose = require("../db");

const ContactSchema = new mongoose.Schema({
  phoneNumber: String,
  email: String,
  linkedId: mongoose.Schema.Types.ObjectId,
  linkPrecedence: {
    type: String,
    enum: ["primary", "secondary"],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Contact", ContactSchema);