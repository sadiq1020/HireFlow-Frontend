import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// POST /api/ai/cover-letter
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobTitle,
      companyName,
      jobType,
      jobLocation,
      jobDescription,
      tone = 'professional',
      extraContext,
      userName,
    } = body as {
      jobTitle: string;
      companyName?: string;
      jobType?: string;
      jobLocation?: string;
      jobDescription?: string;
      tone?: string;
      extraContext?: string;
      userName?: string;
    };

    if (!GEMINI_API_KEY) {
      console.error('[CoverLetter] Missing GEMINI_API_KEY');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    if (!jobTitle) {
      return NextResponse.json({ error: 'jobTitle is required' }, { status: 400 });
    }

    const toneInstructions: Record<string, string> = {
      professional:  'Write in a polished, formal tone. Structured and clear.',
      confident:     'Write in a bold, assertive tone. Lead with strong statements about skills and impact.',
      enthusiastic:  'Write in an energetic, passionate tone. Genuine excitement for the role and company.',
      concise:       'Write in a tight, punchy tone. Maximum impact in minimum words. No filler.',
    };

    const systemPrompt = `You are an expert career coach and cover letter writer for HireFlow, a premium job platform.
Your job is to write compelling, personalized cover letters that get interviews.

Rules:
- Write ONLY the cover letter text — no subject line, no "Here is your letter:", no markdown, no preamble.
- 3 short paragraphs max. Around 200-250 words total. Recruiters don't read long letters.
- Opening: hook that directly addresses the role and shows genuine understanding of what they need.
- Middle: 2-3 concrete, specific skills or achievements relevant to this role. Not generic buzzwords.
- Closing: confident call to action. No "I hope to hear from you" — be decisive.
- Use the applicant's name if provided, otherwise skip it.
- If extra background info is given, weave specific details in naturally.
- Tone: ${toneInstructions[tone] || toneInstructions.professional}
- Do NOT include "Dear Hiring Manager" or any salutation — start directly with the hook.
- Do NOT include sign-off or signature — end after the closing paragraph.`;

    const userPrompt = `Write a cover letter for this job:

Job Title: ${jobTitle}
${companyName  ? `Company: ${companyName}`   : ''}
${jobType      ? `Job Type: ${jobType}`       : ''}
${jobLocation  ? `Location: ${jobLocation}`   : ''}
${jobDescription ? `\nJob Description (excerpt):\n${jobDescription}` : ''}
${userName     ? `\nApplicant Name: ${userName}` : ''}
${extraContext ? `\nApplicant Background:\n${extraContext}` : ''}

Write the cover letter now.`;

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('[CoverLetter] Gemini error:', JSON.stringify(err));
      return NextResponse.json({ error: 'AI service error' }, { status: response.status });
    }

    const data = await response.json();
    const coverLetter = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    if (!coverLetter) {
      return NextResponse.json({ error: 'Empty response from AI' }, { status: 500 });
    }

    return NextResponse.json({ coverLetter });
  } catch (err) {
    console.error('[CoverLetter] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
