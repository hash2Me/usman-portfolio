import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

const SYSTEM_PROMPT = `You are Usman Mubarak's friendly portfolio AI buddy! You answer questions about Usman in a casual, conversational, and upbeat way.
Speak in the third person (e.g., "Usman is...", "He built...").

STYLE & TONE RULES:
- Keep it casual, warm, and natural — like a friendly developer friend chatting.
- STRICTLY SHORT RESPONSES: Keep answers to 1 to 3 short sentences max. NEVER write long walls of text or multiple paragraphs.
- Be interactive: End with a quick, relevant follow-up question or engaging prompt (e.g., "Curious about the tech stack he used?", "Want to see what he's building next?").
- If listing items, list at most 2 or 3 quick bullet points or comma-separated items.

Here is what you know about Usman:
- Role: Frontend Engineer (UI/UX) at Quantum Logic Limited (2026 — Present). Loves creating slick, responsive web apps.
- Education: BS Software Engineering at COMSATS University Islamabad, Lahore Campus (3rd semester).
- Core Skills: C++, Java, Python, JavaScript, React.js, React Native, Tailwind CSS, plus heavy custom Data Structures & Algorithms.
- Projects:
  1. Zombie Maze Siege: 2D survival game in C++17 & SFML using 6 custom-built DSA data structures (no STL shortcuts!) with BFS zombie AI.
  2. E-Commerce Frontend Dashboard: Fast, responsive React dashboard with live REST API integration.
  3. Task Management App: Cross-platform task tracker for web and mobile using React & React Native.
  4. PF-Project: C++ console survival game focused on procedural logic.

GUARDRAILS:
- Stay focused on Usman, his projects, skills, and work.
- If someone asks something off-topic, playfully steer them back: "Haha, I'm just here to chat about Usman and his code! Want to hear about his projects?"
- Never fabricate info.`;

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array' });
    }

    const validMessages = messages.filter(
      (m: { role?: string; content?: string }) =>
        (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim().length > 0
    );

    const lastUserMessage = [...validMessages].reverse().find(m => m.role === 'user')?.content || '';

    // 1. Try Google Gemini API if key is available
    if (process.env.GEMINI_API_KEY) {
      const candidateModels = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare contents for Gemini (map assistant to model)
      const contents = validMessages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents,
            config: {
              systemInstruction: SYSTEM_PROMPT,
            },
          });

          if (response.text && response.text.trim()) {
            return res.json({ reply: response.text.trim() });
          }
        } catch (modelErr) {
          console.warn(`Gemini model ${model} failed:`, (modelErr as Error)?.message || modelErr);
          // Continue to next model
        }
      }
    }

    // 2. Fallback to Anthropic API if key is provided
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 600,
            system: SYSTEM_PROMPT,
            messages: validMessages,
          }),
        });

        if (anthropicResponse.ok) {
          const data = await anthropicResponse.json();
          if (data.content?.[0]?.text) {
            return res.json({ reply: data.content[0].text });
          }
        } else {
          console.warn('Anthropic API responded with error:', anthropicResponse.status);
        }
      } catch (anthropicErr) {
        console.warn('Anthropic fetch error:', (anthropicErr as Error)?.message);
      }
    }

    // 3. Robust domain-knowledge fallback responder
    const fallbackReply = getFallbackResponse(lastUserMessage);
    return res.json({ reply: fallbackReply });
  } catch (err) {
    console.error('Chat endpoint error:', err);
    return res.json({
      reply: "Hey! Usman's currently building slick web apps at Quantum Logic Limited and hacking on C++ games. What would you like to check out first?",
    });
  }
});

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('project') || q.includes('zombie') || q.includes('maze') || q.includes('game') || q.includes('c++') || q.includes('siege')) {
    return "Usman built **Zombie Maze Siege**—a 2D survival game in C++17 with 6 custom DSA structures (no STL shortcuts!) and BFS zombie pathfinding! He also created a React E-Commerce Dashboard and a Task Manager. Want to know more about the zombie game?";
  }

  if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('dsa')) {
    return "His core stack is **React, React Native, and Tailwind** for frontend, plus **C++, Java, and Python** with deep DSA problem-solving. Interested in his frontend work or low-level algorithms?";
  }

  if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('quantum') || q.includes('company')) {
    return "He's currently working as a **Frontend Engineer (UI/UX)** at **Quantum Logic Limited**, crafting responsive user interfaces and optimizing web apps. Want to know about what he works on day-to-day?";
  }

  if (q.includes('education') || q.includes('degree') || q.includes('university') || q.includes('college') || q.includes('comsats')) {
    return "Usman is studying **Software Engineering at COMSATS Lahore** (currently 3rd semester), taking deep dives into Data Structures, SQA, and algorithms. Curious about his courses?";
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach') || q.includes('github') || q.includes('linkedin')) {
    return "You can ping Usman directly via the Contact section below, or check out his GitHub and LinkedIn in the links above! Ready to drop him a message?";
  }

  return "Hey there! I'm Usman's portfolio AI buddy. He's a Software Engineer obsessed with custom DSA and sleek React UI. Want to hear about his zombie game or his work at Quantum Logic?";
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
