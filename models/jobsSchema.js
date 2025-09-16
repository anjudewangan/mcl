const mongoose = require('mongoose')

const jobsSchema = new mongoose.Schema({
    subcategory: String,
    name: String,
    timel2: Number,
    timel3: Number,
    category: String,
});

module.exports = mongoose.model("jobs", jobsSchema);