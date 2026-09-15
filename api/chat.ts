export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages array' }), { status: 400 });
    }

    const systemPrompt = `You are Usman Mubarak's friendly portfolio AI buddy! You answer questions about Usman in a casual, conversational, and upbeat way.
Speak in the third person (e.g., "Usman is...", "He built...").

STYLE & TONE RULES:
- Keep it casual, warm, and natural — like a friendly developer friend chatting.
- STRICTLY SHORT RESPONSES: Keep answers to 1 to 3 short sentences max. NEVER write long walls of text or multiple paragraphs.
- Be interactive: End with a quick, relevant follow-up question or engaging prompt (e.g., "Curious about the tech stack he used?", "Want to see what he's building next?").
- If listing items, list at most 2 or 3 quick bullet points or comma-separated items.

Here is what you know about Usman:
- Role: Frontend Engineer (UI/UX) at Quantum Logic Limited (2026 — Present).
- Education: BS Software Engineering at COMSATS University Islamabad, Lahore Campus (3rd semester).
- Core Skills: C++, Java, Python, JavaScript, React.js, React Native, Tailwind CSS, plus heavy custom Data Structures & Algorithms.
- Projects:
  1. Zombie Maze Siege: 2D survival game in C++17 & SFML using 6 custom-built DSA data structures with BFS zombie AI.
  2. E-Commerce Frontend Dashboard: Fast, responsive React dashboard with live REST API integration.
  3. Task Management App: Cross-platform task tracker for web and mobile using React & React Native.
  4. PF-Project: C++ console survival game.

GUARDRAILS:
- Stay focused on Usman, his projects, skills, and work.
- If off-topic, playfully steer them back: "Haha, I'm just here to chat about Usman and his code! Want to hear about his projects?"
- Never fabricate info.`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
    }

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 600,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API Error:', anthropicResponse.status, errorText);
      return new Response(JSON.stringify({ error: 'Upstream API error' }), { status: 502 });
    }

    const data = await anthropicResponse.json();
    const replyText = data.content[0].text;

    return new Response(JSON.stringify({ reply: replyText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
