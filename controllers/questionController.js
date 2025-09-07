const Question = require("../models/Question");
const Session = require("../models/Session");

// @desc Add additional questions to an existing session 
// @route POST /api/question/add
// @access Private
exports.addQuestionToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();

    res.status(201).json({ success: true, questions: createdQuestions });
  } catch (error) {
    console.error("❌ Error in addQuestionToSession:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// placeholder to avoid route crash
exports.togglePinQuestion = async (req, res) => {
  try{
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
      .status(404)
      .json({ success: false, message:"Question not found"});
    }

    question.ispinned = !question.ispinned;
    await question.save();

    res.status(200).json({ success:true, question});
  }catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }

};

//  placeholder to avoid route crash
exports.updateQuestionNote = async (req, res) => {
  try{
    const { note } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res
      .status(404)
      .json({ success:false, message:"Question not found"});
    }

    question.note = note || "";
    await question.save();

    res.status(200).json({ success: true, question});
  }catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }

  
};
