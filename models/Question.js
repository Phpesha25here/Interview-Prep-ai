const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session", // ✅ Use capital "S" to match the actual model name
      required: true,
    },
    question: {
      type: String,
      required: true, // ✅ Validation added
      trim: true,
    },
    answer: {
      type: String,
      required: true, // ✅ Validation added
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    ispinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
