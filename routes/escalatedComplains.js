const router = require("express").Router();
const { managerEscalatedComplains } = require("../controllers/escalatedComplains");

router.get("/managerEscalatedComplains", managerEscalatedComplains);

module.exports = router;