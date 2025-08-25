import { NextRequest, NextResponse } from 'next/server';
import { generateQuestionsWithGemini, GenerateQuestionsParams } from '@/lib/gemini-question-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateQuestionsParams;
    
    // Validate input
    if (!body.topic || !body.difficulty || !body.questionCount) {
      return NextResponse.json(
        { error: 'Missing required fields: topic, difficulty, questionCount' },
        { status: 400 }
      );
    }

    if (body.questionCount < 1 || body.questionCount > 5) {
      return NextResponse.json(
        { error: 'Question count must be between 1 and 20 (Gemini free tier limit)' },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500  }
      );
    }

    const questions = await generateQuestionsWithGemini(body);
    console.log('Generated questions:', questions);
    return NextResponse.json({ 
      questions,
      generated_at: new Date().toISOString(),
      model: 'gemini-pro'
    }, { status: 200 });
  } catch (error) {
    console.error('Error in generate-questions API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate questions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
