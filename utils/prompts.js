const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
You are an AI that generates only JSON output for technical interview preparation.

Instructions:
- Role: ${role}
- Experience Level: ${experience} years
- Topics to Focus: ${topicsToFocus}
- Number of Questions: ${numberOfQuestions}

Output Format:
Return only a valid JSON array. No markdown, no code blocks, no explanations.

Example:
[
  {
    "question": "What is a closure in JavaScript?",
    "answer": "A closure is the combination of a function and the lexical environment..."
  },
  ...
]

Important:
- Do not add any commentary or formatting.
- Escape all characters properly. Use only double quotes.
`;

const conceptExplainPrompt = (question) => `
You are an AI that returns a JSON object explaining a coding concept clearly.

Instructions:
- Explain the following question in detail: "${question}"
- Provide a short, relevant title for the explanation.
- The explanation should be beginner-friendly and may include a small code example.

Output Format:
{
  "title": "Short concept title",
  "explanation": "Full explanation here. If needed, include escaped code examples like: \\nfunction example() { ... }\\n"
}

Important:
- Do not include markdown, code blocks, or triple backticks.
- Return valid JSON only. No extra text.
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
