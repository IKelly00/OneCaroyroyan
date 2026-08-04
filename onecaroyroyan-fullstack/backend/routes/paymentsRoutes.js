const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/paymentsController");
const { requireAuth, requireRole } = require("../middleware/auth");

const CAN_MANAGE = ["Administrator", "Accounting Clerk", "Treasurer"];

router.use(requireAuth);
router.get("/", ctrl.getPayments);
router.post("/", requireRole(...CAN_MANAGE), ctrl.createPayment);
router.patch("/:id/validate", requireRole("Administrator", "Treasurer"), ctrl.validatePayment);

module.exports = router;
