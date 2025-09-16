const mongoose = require('mongoose')

const escalatedSchema = new mongoose.Schema({
    Category: String,
    Level: Number,
    UserID: String,
    Password: String,
    Area: String,
    Name: String,
    Contact: Number,
    Email_Id: String,
    Designation: String,
    Active: Boolean,
});
module.exports = new mongoose.model("escalated_matrix", escalatedSchema);