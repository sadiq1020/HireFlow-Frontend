import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

interface JobSummary {
  id: string;
  title: string;
  company?: string;
  location?: string;
  type?: string;
  category?: string;
  salaryMin?: number;
  salaryMax?: number;
}

interface AppliedJob {
  title?: string;
  category?: string;
  type?: string;
  location?: string;
}

// POST /api/ai/recommend
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userName, appliedJobs, availableJobs } = body as {
      userName: string;
      appliedJobs: AppliedJob[];
      availableJobs: JobSummary[];
    };

    if (!GEMINI_API_KEY) {
      console.error('[Recommend] Missing GEMINI_API_KEY');
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    if (!availableJobs || availableJobs.length === 0) {
      return NextResponse.json({
        recommendations: [],
        profileSummary: 'No jobs available to match right now.',
      });
    }

    const hasHistory = appliedJobs && appliedJobs.length > 0;

    const systemPrompt = `You are a precise job matching engine for HireFlow, an AI-powered job board. 
Your job is to analyze a seeker's application history and return the top matching jobs from a pool, with a match score and a brief personalized reason.

Rules:
- Return ONLY valid JSON. No markdown, no explanation, no preamble.
- Pick 3 to 6 jobs that best match the seeker's inferred preferences.
- matchScore: integer 0–100 based on how well the job matches their history/inferred skills.
- matchReason: 1 sentence, max 12 words, specific to why this job suits them. Start with a verb or adjective. E.g. "Matches your engineering background and remote work preference." DO NOT use quotes inside the strings.
- profileSummary: 1 short sentence summarizing what you inferred. Max 10 words. E.g. "Based on your 3 engineering applications." DO NOT use quotes inside the string.
- If no history, recommend trending/varied jobs and set profileSummary to "Showing top-rated opportunities for new seekers."
- Only return jobs from the provided availableJobs list (use their exact IDs).
- Sort by matchScore descending.

Response format (strict JSON):
{
  "profileSummary": "...",
  "recommendations": [
    { "id": "job_id_here", "matchScore": 87, "matchReason": "..." },
    ...
  ]
}`;

    const userMessage = `Seeker name: ${userName}

${hasHistory
  ? `Application history (${appliedJobs.length} jobs):
${JSON.stringify(appliedJobs, null, 2)}`
  : 'Application history: None (new user)'}

Available jobs pool (${availableJobs.length} jobs):
${JSON.stringify(availableJobs, null, 2)}

Return the best matching jobs as JSON.`;

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
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        generationConfig: {
          response_mime_type: "application/json",
          maxOutputTokens: 1000,
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('[Recommend] Gemini error:', JSON.stringify(err));
      return NextResponse.json({ error: 'AI service error' }, { status: response.status });
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    let parsed: { profileSummary: string; recommendations: any[] };
    try {
      // Extract just the JSON object from the response (ignores any preamble/postamble text)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      let cleanRaw = jsonMatch ? jsonMatch[0] : raw;

      // Fix trailing commas which are common AI hallucinations in JSON
      cleanRaw = cleanRaw.replace(/,\s*([\]}])/g, '$1');

      parsed = JSON.parse(cleanRaw);
    } catch (parseError) {
      console.error('[Recommend] JSON parse failed. Raw text was:', raw);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Safety: validate the shape
    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      return NextResponse.json({
        profileSummary: parsed.profileSummary ?? 'Personalized picks for you.',
        recommendations: [],
      });
    }

    // Validate each recommendation has required fields
    const validated = parsed.recommendations
      .filter((r) => r.id && typeof r.matchScore === 'number' && r.matchReason)
      .slice(0, 6); // cap at 6

    return NextResponse.json({
      profileSummary: parsed.profileSummary ?? 'Personalized picks based on your activity.',
      recommendations: validated,
    });
  } catch (err) {
    console.error('[Recommend] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}