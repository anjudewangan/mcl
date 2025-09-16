const mongoose = require('mongoose')

const technicianSchema = new mongoose.Schema({
    Name: String,
    Contact: String,
    Email_Id: String,
    Location: String,
    Employee_Id: String,
    Date: String,
    Time: String,
    Category: String,
    Manager_Name: String,
    Total_complaints: Number,
    Open_complaints: Number,
    Close_complaints: Number,
});

module.exports = new mongoose.model("technician", technicianSchema);