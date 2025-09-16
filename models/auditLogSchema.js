const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    action: { type: String, required: true },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: mongoose.Schema.Types.Mixed },
});


module.exports = mongoose.model('auditLog', auditLogSchema);