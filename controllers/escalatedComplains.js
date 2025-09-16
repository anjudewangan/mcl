const Complains = require("../models/complainSchema")

exports.managerEscalatedComplains = async (req, res) => {
    try {
        const managerDetails = req.session.user
        const category = managerDetails.Category.slice(0, 1) + managerDetails.Category.slice(1).toLowerCase()
        const level = `L${managerDetails.Level}`
        const colony = managerDetails.Area

        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const escalatedComplaintsRequest = Complains.find({ Category: category, Escalation_Level: level, Colony: colony })
            .skip(skip)
            .limit(limit);

        const countRequest = Complains.countDocuments({ Category: category, Escalation_Level: level, Colony: colony });

        const [escalatedComplaints, count] = await Promise.all([escalatedComplaintsRequest, countRequest]);

        res.status(200).json({
            success: true,
            data: escalatedComplaints,
            totalCount: count
        });
    } catch (error) {
        console.error("Error fetching escalated complaints:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
