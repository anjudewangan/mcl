const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phoneNumber: String,
    subject: String,
    message: String,
});

module.exports = mongoose.model("contactUs", contactSchema);