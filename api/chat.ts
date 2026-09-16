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
    if (apiKey) {
      try {
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

        if (anthropicResponse.ok) {
          const data = await anthropicResponse.json();
          const replyText = data.content?.[0]?.text;
          if (replyText) {
            return new Response(JSON.stringify({ reply: replyText }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
      } catch (err) {
        console.warn('Anthropic API request failed, utilizing fallback responder:', err);
      }
    }

    // Knowledge fallback responder for Vercel edge deployment without API key
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
    let fallbackReply = "Hey there! I'm Usman's portfolio AI buddy. Usman is a Software Engineering student & Frontend Engineer at Quantum Logic Limited obsessed with custom DSA and React! Want to hear about his Zombie game or web apps?";

    if (lastMsg.includes('project') || lastMsg.includes('zombie') || lastMsg.includes('maze') || lastMsg.includes('game') || lastMsg.includes('siege') || lastMsg.includes('build')) {
      fallbackReply = "Usman built **Zombie Maze Siege**—a 2D survival game in C++17 with 6 custom DSA structures (no STL shortcuts!) and BFS zombie pathfinding! He also created a React E-Commerce Dashboard and a Task Manager. Want to know more about the zombie game?";
    } else if (lastMsg.includes('skill') || lastMsg.includes('tech') || lastMsg.includes('stack') || lastMsg.includes('language') || lastMsg.includes('dsa')) {
      fallbackReply = "His core stack is **React, React Native, and Tailwind** for frontend, plus **C++, Java, and Python** with deep DSA problem-solving. Interested in his frontend work or low-level algorithms?";
    } else if (lastMsg.includes('experience') || lastMsg.includes('work') || lastMsg.includes('job') || lastMsg.includes('quantum') || lastMsg.includes('company')) {
      fallbackReply = "He's currently working as a **Frontend Engineer (UI/UX)** at **Quantum Logic Limited**, crafting responsive user interfaces and optimizing web apps. Want to know about what he works on day-to-day?";
    } else if (lastMsg.includes('education') || lastMsg.includes('degree') || lastMsg.includes('university') || lastMsg.includes('college') || lastMsg.includes('comsats')) {
      fallbackReply = "Usman is studying **Software Engineering at COMSATS Lahore** (currently 3rd semester), taking deep dives into Data Structures, SQA, and algorithms. Curious about his courses?";
    } else if (lastMsg.includes('contact') || lastMsg.includes('hire') || lastMsg.includes('email') || lastMsg.includes('reach') || lastMsg.includes('github') || lastMsg.includes('linkedin')) {
      fallbackReply = "You can ping Usman directly via the Contact section below, or check out his GitHub and LinkedIn in the links above! Ready to drop him a message?";
    }

    return new Response(JSON.stringify({ reply: fallbackReply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return new Response(JSON.stringify({ reply: "Hey! Usman's currently building slick web apps at Quantum Logic Limited and hacking on C++ games. What would you like to check out first?" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
