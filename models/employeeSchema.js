const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    EIS: String,
    Password: String,
    Name: String,
    Contact: Number,
    COLONY: String,
    AREA: String,
    Designation: String,
    Qr: String,
    DEPT: String,
    AREA: String,
});

module.exports = new mongoose.model("employee_data", employeeSchema);