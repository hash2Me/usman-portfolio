import { useState, useRef, useEffect, useCallback } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! 👋 I'm Usman's portfolio bot. Ask me about his projects, skills, or what he's building right now!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIdleTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Event dispatching for Avatar integration ───────────────────────────────

  const dispatchChatEvent = useCallback((state: string) => {
    window.dispatchEvent(new CustomEvent('chatbot-state', { detail: { state } }));
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // ── Toggle ─────────────────────────────────────────────────────────────────

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    dispatchChatEvent(next ? 'opened' : 'closed');
  };

  // ── Input change (typing detection) ────────────────────────────────────────

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim()) {
      dispatchChatEvent('user-typing');
      if (typingIdleTimerRef.current) clearTimeout(typingIdleTimerRef.current);
      typingIdleTimerRef.current = setTimeout(() => dispatchChatEvent('idle'), 2000);
    } else {
      dispatchChatEvent('idle');
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setError(null);

    // Clear typing timer, signal bot is working
    if (typingIdleTimerRef.current) clearTimeout(typingIdleTimerRef.current);
    dispatchChatEvent('bot-responding');

    try {
      const apiMessages = [...messages, { role: 'user', content: userMessage }]
        .filter(m => m.role === 'user' || m.role === 'assistant');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      dispatchChatEvent('bot-done');
    } catch (err) {
      console.error(err);
      setError('Oops, something went sideways! Try asking again.');
      dispatchChatEvent('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // Cleanup typing timer
  useEffect(() => {
    return () => { if (typingIdleTimerRef.current) clearTimeout(typingIdleTimerRef.current); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end pointer-events-none">

      {/* Chat Window */}
      <div
        className={`pointer-events-auto transition-all duration-300 origin-bottom-right mb-4 flex flex-col bg-white border-2 border-black shadow-hard w-[320px] sm:w-[380px] h-[450px] overflow-hidden ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-black text-white px-4 py-3 flex justify-between items-center border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest">Usman's Agent</span>
          </div>
          <button
            onClick={handleToggle}
            className="text-white hover:text-slate-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white p-1"
            aria-label="Close chat"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M1 13L13 1L1 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/>
            </svg>
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[85%] px-4 py-3 text-sm font-medium leading-relaxed border-2 border-black whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-black text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl'
                    : 'bg-white text-black rounded-tl-xl rounded-tr-xl rounded-br-xl'
                }`}
                style={{
                  boxShadow: msg.role === 'user' ? '-2px 2px 0px 0px rgba(0,0,0,1)' : '2px 2px 0px 0px rgba(0,0,0,1)'
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="max-w-[85%] px-4 py-3 bg-white text-black border-2 border-black rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center mt-2">
              <div className="px-3 py-1.5 bg-red-100 text-red-900 border-2 border-red-900 text-xs font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            </div>
          )}
          {/* Interactive quick prompt suggestions */}
          {!isLoading && messages.length <= 3 && (
            <div className="pt-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                Quick Questions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'What does Usman build?',
                  'Tell me about the Zombie game!',
                  'What tech stack does he love?',
                  'Where does he work?'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="text-xs bg-white text-black border border-black px-2.5 py-1 font-semibold rounded-md hover:bg-black hover:text-white transition-colors text-left shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-3 bg-white border-t-2 border-black flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask anything about Usman..."
            className="flex-1 bg-white border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-0 focus:shadow-hard transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-black text-white px-4 py-2 border-2 border-black font-bold uppercase text-xs tracking-wider hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="pointer-events-auto group flex items-center justify-center w-14 h-14 bg-black text-white border-2 border-black shadow-hard hover:shadow-hard-hover hover:-translate-y-1 transition-all duration-200"
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2L18 18M2 18L18 2L2 18Z" stroke="currentColor" strokeWidth="3" strokeLinecap="square"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20V16H14L10 20V16H4V4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square"/>
          </svg>
        )}
      </button>
    </div>
  );
}
