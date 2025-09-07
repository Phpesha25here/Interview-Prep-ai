const { GoogleGenerativeAI } = require("@google/generative-ai");
const { questionAnswerPrompt, conceptExplainPrompt } = require("../utils/prompts");
require("dotenv").config();
const JSON5 = require("json5");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper: Clean and parse Gemini output safely
function extractJsonSafely(rawText) {
  // Remove code block markers if present
  const match = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  let cleaned = match ? match[1] : rawText;

  cleaned = cleaned
    .replace(/,\s*([}\]])/g, "$1")         // Remove trailing commas
    .replace(/\r?\n/g, " ")                // Remove newlines
    .replace(/\\(?!["\\/bfnrtu])/g, "\\\\") // Escape stray backslashes
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (_) {
    return JSON5.parse(cleaned); // fallback if JSON is malformed
  }
}

// @desc Generate interview questions
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = await response.text();

    const data = extractJsonSafely(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating interview questions:", error.message);
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc Generate concept explanation
const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Missing question" });
    }

    const prompt = conceptExplainPrompt(question);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = await response.text();

    const data = extractJsonSafely(rawText);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error generating concept explanation:", error.message);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation,
};
