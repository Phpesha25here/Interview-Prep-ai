// routes/aiRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("../controllers/aiController");

router.post("/generate-questions", protect, generateInterviewQuestions);
router.post("/generate-explanation", protect, generateConceptExplanation);

module.exports = router;
