import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// POST /api/ai/generate-jd
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobTitle,
      jobType,
      jobLocation,
      categoryName,
      seniority = 'mid',
      style = 'corporate',
      extraContext,
    } = body as {
      jobTitle: string;
      jobType?: string;
      jobLocation?: string;
      categoryName?: string;
      seniority?: string;
      style?: string;
      extraContext?: string;
    };

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 });
    }

    if (!jobTitle) {
      return NextResponse.json({ error: 'jobTitle is required' }, { status: 400 });
    }

    // ── Tone descriptions ──────────────────────────────────────────────────────
    const styleGuide: Record<string, string> = {
      corporate:  'Formal, structured, and professional. Suitable for enterprise or traditional industries.',
      startup:    'Dynamic, energetic, and mission-driven. Emphasize impact, growth, and flat structure.',
      friendly:   'Warm, inclusive, and approachable. Make candidates feel welcome and excited.',
      technical:  'Precise and detailed. Emphasize tech stack, architecture, and engineering culture. Use specific technical terms.',
    };

    const seniorityGuide: Record<string, string> = {
      junior:  'Entry-level or 0-2 years experience. Emphasize learning opportunities, mentorship, and growth. Requirements should be achievable for new grads.',
      mid:     'Mid-level, 3-5 years experience. Balance of independence and collaboration. Solid fundamentals expected.',
      senior:  'Senior-level, 5+ years. Expect deep expertise, ownership, and ability to mentor others. High autonomy.',
      lead:    'Tech lead or principal level. Expect architecture decisions, cross-team influence, and technical roadmap ownership.',
    };

    const systemPrompt = `You are an expert HR professional and technical recruiter writing job listings for HireFlow, a premium job board.

Your goal is to write compelling job descriptions that attract qualified candidates and accurately represent the role.

Style: ${styleGuide[style] || styleGuide.corporate}
Seniority: ${seniorityGuide[seniority] || seniorityGuide.mid}

Rules:
- Return ONLY valid JSON. No markdown, no explanation, no preamble.
- Write genuinely useful, specific content — not generic filler.
- description: 3-4 paragraphs. Cover: role overview, day-to-day responsibilities, team context, and what success looks like. Around 250-350 words.
- requirements: A clean list of 6-9 bullet points using "•" as the bullet character. Mix must-haves with nice-to-haves. Be realistic for the seniority level. Around 150-200 words total.
- Do NOT use markdown headers or bold in the output text.
- Do NOT include salary, company name placeholder, or "we are hiring" phrasing.

Response format (strict JSON, no extra keys):
{
  "description": "...",
  "requirements": "..."
}`;

    const userPrompt = `Write a job description and requirements for this position:

Job Title: ${jobTitle}
${jobType      ? `Job Type: ${jobType.replace('_', ' ')}`  : ''}
${jobLocation  ? `Location: ${jobLocation}`                 : ''}
${categoryName ? `Category: ${categoryName}`                : ''}
Seniority: ${seniority}
Tone: ${style}
${extraContext ? `\nAdditional context from the employer:\n${extraContext}` : ''}

Write the job description and requirements as JSON now.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            response_mime_type: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('[GenerateJD] Gemini error:', err);
      return NextResponse.json({ error: 'AI service error' }, { status: response.status });
    }

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';

    let parsed: { description: string; requirements: string };
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error('[GenerateJD] JSON parse failed:', raw);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    if (!parsed.description || !parsed.requirements) {
      return NextResponse.json({ error: 'Incomplete AI response' }, { status: 500 });
    }

    return NextResponse.json({
      description:  parsed.description.trim(),
      requirements: parsed.requirements.trim(),
    });
  } catch (err) {
    console.error('[GenerateJD] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}