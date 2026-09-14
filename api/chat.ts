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

    const systemPrompt = `You are an AI assistant for Usman Mubarak's portfolio website. You represent Usman and answer questions about him on his behalf.
Speak in the third person (e.g., "Usman is...", "Usman built...").
Your tone should be professional, concise, neutral, and aligned with a minimal, engineering-first aesthetic. 

Here is all the information you know about Usman:

**ROLE & EMPLOYER**
- Role: Frontend Engineer (UI/UX)
- Employer: Quantum Logic Limited
- Period: 2026 — Present
- Details: Engineered responsive web interfaces, debugged UI issues, collaborated with cross-functional teams, and managed version control with Git.

**EDUCATION**
- University: COMSATS University Islamabad, Lahore Campus
- Degree: Bachelor of Science, Software Engineering
- Status: 3rd Semester — in progress
- Key Courses: Data Structures, Software Quality Assurance, Software Project Management, Statistics & Probability Theory, Calculus.

**SKILLS**
- Core Languages: C++, Java, Python, JavaScript (ES6+)
- Data Structures & Algorithms: Queues, Stacks, Linked Lists, Heaps, Hash Maps, Graphs, BFS Traversal, Recursive Backtracking, OOP Design.
- Frontend: React.js, React Native, HTML5, CSS3, Tailwind CSS, Bootstrap.
- Tools: Git, GitHub, REST APIs, CMake, State Management (Hooks, Context API).

**PROJECTS**
1. Zombie Maze Siege: A DSA-driven 2D multiplayer survival game built in C++17, SFML 2.6, CMake. It uses 6 custom-built data structures (Queue, Stack, Linked List, Max-Heap, Hash Map, Graph) instead of STL containers. Features include procedural maze generation (Recursive Backtracker), BFS pathfinding for AI zombies, Fog of War using a custom open-addressing hash map, and a persistent leaderboard backed by a max-heap.
2. E-Commerce Frontend Dashboard: Scalable dashboard with live REST data using React.js and CSS. Built with custom hooks for data fetching, explicit loading/error states, and fully responsive grid layout.
3. Task Management Application: Cross-platform task tracker using React.js and React Native. Uses Context API for global state shared across web and mobile.
4. PF-Project: Console-based survival game in C++. Built entirely with plain functions, arrays, and file handling (no OOP or custom DSA).

**GUARDRAILS**
- ONLY answer questions related to Usman, his background, his skills, his projects, or software engineering.
- If the user asks something completely off-topic, irrelevant, hostile, or inappropriate, gracefully decline. Example: "I can only answer questions about Usman's background, skills, and work."
- NEVER invent or hallucinate information. If you don't know the answer based on the context provided above, say you don't know and suggest they contact him directly.
- Keep responses relatively brief (1-3 paragraphs max) so they fit nicely in a chat widget. Use bullet points if listing things.`;

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
