import { GoogleGenAI } from '@google/genai';

export interface GenerateQuestionsParams {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  gradeLevel?: string;
  additionalContext?: string;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
  difficulty: string;
  topic: string;
}

export async function generateQuestionsWithGemini(params: GenerateQuestionsParams): Promise<GeneratedQuestion[]> {
  const {
    topic,
    difficulty,
    questionCount,
    gradeLevel,
    additionalContext
  } = params;

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const model = 'gemma-3n-e2b-it';

  const sysPrompt = `You are an expert multiple-choice question generator.

Your task: Generate educational MCQs strictly in JSON format. Follow all rules:

Rules:
1. Output must be ONLY valid JSON array (no markdown, no explanations outside JSON).
2. Each question object must include:
   - "question": clear and unambiguous question text
   - "options": array of exactly 4 plausible options
   - "correctAnswer": if the first option is correct than 1, if the second option is correct than 2, if the third option is correct than 3 and if 4th option is correct than 4.
   - "explanation": 1–2 sentence explanation of why the correct answer is correct
   - "difficulty": the provided difficulty level ("${difficulty}")
   - "topic": the provided topic ("${topic}")
3. Exactly ONE correct answer per question. Do not generate multiple correct answers.
4. All questions must be **factually accurate, educational, and aligned to the topic & difficulty**.
5. Distractors (wrong options) must be plausible but clearly incorrect.
6. Do NOT invent false information. If unsure, do not generate the question.
7. Ensure valid JSON syntax, no trailing commas, no extra commentary.

Output Example (structure only, not to be repeated literally):
[
  [
  {
    "question": "What is the primary function of chlorophyll in plants?",
    "options": ["Storing energy", "Absorbing light for photosynthesis", "Transporting water", "Producing oxygen"],
    "correctAnswer": 2,
    "explanation": "Chlorophyll absorbs light energy, primarily red and blue wavelengths, which is essential for photosynthesis.",
    "difficulty": "medium",
    "topic": "Photosynthesis"
  },
  {
    "question": "Which gas is absorbed by plants during photosynthesis?",
    "options": ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    "correctAnswer": 3,
    "explanation": "Plants take in carbon dioxide from the atmosphere as a raw material for photosynthesis.",
    "difficulty": "easy",
    "topic": "Photosynthesis"
  },
  {
    "question": "In which part of the chloroplast does the light-dependent reaction take place?",
    "options": ["Stroma", "Thylakoid membrane", "Mitochondria", "Nucleus"],
    "correctAnswer": 2,
    "explanation": "The light-dependent reactions occur in the thylakoid membranes where chlorophyll absorbs light energy.",
    "difficulty": "medium",
    "topic": "Photosynthesis"
  },
  {
    "question": "What is the main product of the Calvin cycle in photosynthesis?",
    "options": ["Oxygen", "Glucose", "ATP", "Water"],
    "correctAnswer": 2,
    "explanation": "The Calvin cycle uses carbon dioxide, ATP, and NADPH to produce glucose molecules in the stroma of the chloroplast.",
    "difficulty": "hard",
    "topic": "Photosynthesis"
  },
  {
    "question": "Which wavelength of light is least effective for photosynthesis?",
    "options": ["Red", "Blue", "Green", "Violet"],
    "correctAnswer": 3,
    "explanation": "Green light is least effective because chlorophyll reflects it instead of absorbing it.",
    "difficulty": "medium",
    "topic": "Photosynthesis"
  }
]

]
`;




  const prompt = `Create ${questionCount} high-quality, educational ${difficulty} level multiple-choice questions about "${topic}"${gradeLevel ? ` at ${gradeLevel} level` : ''}.

${additionalContext ? `Additional context: ${additionalContext}` : ''}

Generate exactly ${questionCount} questions.`;

console.log("Sending prompt to Gemini:", sysPrompt + "\n" + prompt);

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: sysPrompt + "\n" + prompt }] }],
      config: {
        // systemInstruction: sysPrompt
      },
    });

    // ✅ Correct way to access the text
    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Raw response from Gemini:", rawText);

    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    let cleanedText = rawText.trim();

    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```/, "").replace(/```$/, "").trim();
    }

    // Parse JSON response
    const questions = JSON.parse(cleanedText) as GeneratedQuestion[];
    console.log("Parsed questions:", questions);

    // Validate the response
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format from Gemini AI');
    }

    questions.forEach((q, index) => {
      if (!q.question || !Array.isArray(q.options) || typeof q.correctAnswer !== 'number') {
        throw new Error(`Invalid question format at index ${index}`);
      }
      if (q.correctAnswer < 0 || q.correctAnswer >= q.options.length + 1) {
        throw new Error(`Invalid correct answer index at question ${index}`);
      }
    });

    console.log(`Successfully generated ${questions.length} questions.`);

    return questions;
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    throw new Error(`Failed to generate questions with Gemini AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
