const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    UserName: String,
    Password: String,
    Contact: String,
    Email_Id: String,
    Date: String,
});

module.exports = new mongoose.model("admin", adminSchema);