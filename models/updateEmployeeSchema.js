const mongoose = require("mongoose")

const updateEmployeeSchema = new mongoose.Schema(
    {
        EIS: { type: String, required: true },
        Password: { type: String, required: true },
        Name: { type: String, required: true },
        Contact: { type: Number, required: true },
        COLONY: { type: String, required: true },
        AREA: { type: String, required: true },
        Designation: { type: String, required: true },
        Qr: { type: String, required: true },
        DEPT: { type: String, required: true },
        AREA: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("update-employee", updateEmployeeSchema);