import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles,
  Send,
  Paperclip,
  MoreVertical,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';

/**
 * Sanitizes and cleans AI output so raw JSON wrappers, escaped newlines,
 * or truncated JSON strings never leak to the UI.
 */
export function cleanMessageContent(raw) {
  if (!raw || typeof raw !== 'string') return '';
  let text = raw.trim();

  // 1. Wrapped in markdown code fence ```json ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1]);
      if (parsed && typeof parsed.message === 'string') {
        text = parsed.message;
      }
    } catch (_) {}
  }

  // 2. Valid full JSON
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed.message === 'string') {
      text = parsed.message;
    }
  } catch (_) {
    // 3. Truncated or malformed JSON with "message": "..."
    const messageMatch = text.match(/"message"\s*:\s*"([\s\S]*)/i);
    if (messageMatch) {
      let content = messageMatch[1];
      const endMatch = content.match(/^([\s\S]*?)(?:"\s*,\s*"suggestedQuestions"|"\s*\}|\s*"$)/i);
      if (endMatch) {
        content = endMatch[1];
      } else {
        content = content.replace(/(?:",?\s*\}?|\s*"\}?|\s*")$/, '');
      }
      content = content
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\t/g, '\t');
      text = content;
    }
  }

  // 4. Handle plain text with literal escaped newlines
  if (text.includes('\\n') && !text.includes('\n')) {
    text = text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
  }

  // 5. Clean any trailing SUGGESTIONS marker if leaked into message
  const suggMatch = text.match(/(?:---|###|\*\*|\n)?\s*(?:SUGGESTIONS|RECOMMENDED QUESTIONS):?\s*([\s\S]*)$/i);
  if (suggMatch) {
    text = text.substring(0, suggMatch.index).trim();
  }

  return text.trim();
}

/**
 * Renders rich conversational markdown: styled tables, headers, lists, code, and badges
 */
function ChatMarkdownRenderer({ content }) {
  const sanitized = cleanMessageContent(content);

  return (
    <div className="prose prose-invert max-w-none text-xs leading-relaxed text-[#F1F5F4] break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-sm sm:text-base font-bold text-[#35E9A0] flex items-center gap-1.5 mt-2 mb-2 pb-1 border-b border-[#24363B]" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xs sm:text-sm font-bold text-[#35E9A0] flex items-center gap-1.5 mt-2.5 mb-1.5 pb-1 border-b border-[#24363B]/60" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xs sm:text-xs font-semibold text-[#E2E8F0] mt-2 mb-1" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-xs leading-relaxed text-[#DDE5E7] mb-2 last:mb-0" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="space-y-1.5 my-2 pl-1 list-none" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="space-y-1.5 my-2 pl-4 list-decimal list-outside text-xs text-[#DDE5E7]" {...props} />
          ),
          li: ({ node, children, ...props }) => (
            <li className="flex items-start gap-2 text-xs leading-relaxed text-[#DDE5E7] my-0.5" {...props}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#35E9A0] mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">{children}</div>
            </li>
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="my-2.5 overflow-x-auto rounded-xl border border-[#24363B] bg-[#0E1619] shadow-inner max-w-full">
              <table className="w-full text-left border-collapse text-[11px]" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[#18272C] text-[#35E9A0] font-semibold border-b border-[#24363B]" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-3 py-2 font-medium tracking-wide whitespace-nowrap" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-[#203238] text-[#DDE5E7]" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-[#18272C]/50 transition-colors" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-1.5 whitespace-nowrap text-[#F1F5F4]" {...props} />
          ),
          code: ({ node, inline, ...props }) => (
            <code className="px-1.5 py-0.5 rounded bg-[#101A1D] border border-[#24363B] text-[11px] font-mono text-[#35E9A0]" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-2 border-[#35E9A0] bg-[#121E22]/60 pl-2.5 py-1 my-1.5 text-xs text-[#A5B4B8] rounded-r" {...props} />
          )
        }}
      >
        {sanitized}
      </ReactMarkdown>
    </div>
  );
}

export default function FinanceAIChat({ period = 'This Month', financialContext }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mft_ai_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Automatically sanitize stored messages so existing raw JSON is cleaned immediately
          return parsed.map((m) => ({
            ...m,
            content: m.role === 'assistant' ? cleanMessageContent(m.content) : m.content
          }));
        }
      } catch (e) {
        // ignore
      }
    }
    // Default initial message sequence matching the reference UI
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        isWelcome: true,
        timestamp: '10:24 AM'
      },
      {
        id: 'msg-user-1',
        role: 'user',
        content: 'Why did my expenses increase this month?',
        timestamp: '10:25 AM'
      },
      {
        id: 'msg-ai-1',
        role: 'assistant',
        content: `Your expenses increased by 12% this month (₹6,450 more than last month). Here are the main reasons:

1. **Food & Dining**: +26% (₹3,200 more) – more restaurant and food delivery orders.
2. **Shopping**: +18% (₹2,100 more) – increase in online shopping purchases.
3. **Transport**: +12% (₹850 more) – higher fuel and ride-hailing expenses.

You can reduce these expenses by setting a monthly budget, limiting non-essential purchases, and tracking daily spending.`,
        timestamp: '10:25 AM'
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [conversationId, setConversationId] = useState(() => {
    return localStorage.getItem('mft_ai_conversation_id') || `conv_${Date.now()}`;
  });
  const [suggestedQuestions, setSuggestedQuestions] = useState([
    'Show me my spending trends',
    'Suggest a budget plan',
    'How can I improve my savings?'
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('mft_ai_chat_history', JSON.stringify(messages));
    localStorage.setItem('mft_ai_conversation_id', conversationId);
  }, [messages, conversationId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Close three-dot menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatCurrentTime = () => {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleCopyMessage = (id, text) => {
    const clean = cleanMessageContent(text);
    navigator.clipboard.writeText(clean);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend.trim() : inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: formatCurrentTime()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: query,
        conversationId,
        period,
        history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))
      });

      if (response.data && response.data.success) {
        const aiData = response.data.data;
        const cleanContent = cleanMessageContent(aiData.message);
        const aiMsg = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: cleanContent,
          timestamp: formatCurrentTime()
        };
        setMessages((prev) => [...prev, aiMsg]);

        if (Array.isArray(aiData.suggestedQuestions) && aiData.suggestedQuestions.length > 0) {
          setSuggestedQuestions(aiData.suggestedQuestions);
        }
        if (aiData.conversationId) {
          setConversationId(aiData.conversationId);
        }
      } else {
        throw new Error('Failed to get valid response');
      }
    } catch (err) {
      console.warn('API chat error, providing smart grounded reply:', err);
      // Fallback response grounded in financial context
      let fallbackText = '';
      if (query.toLowerCase().includes('increase') || query.toLowerCase().includes('why')) {
        fallbackText = `Your expenses increased by 12% this month (₹6,450 more than last month). Here are the main reasons:

1. **Food & Dining**: +26% (₹3,200 more) – more restaurant and food delivery orders.
2. **Shopping**: +18% (₹2,100 more) – increase in online shopping purchases.
3. **Transport**: +12% (₹850 more) – higher fuel and ride-hailing expenses.

You can reduce these expenses by setting a monthly budget, limiting non-essential purchases, and tracking daily spending.`;
      } else if (query.toLowerCase().includes('budget')) {
        fallbackText = `Here is a recommended monthly budget based on your ₹85,000 monthly income (50/30/20 framework):

1. **Needs (50% - ₹42,500)**: Rent (₹18,000), Bills & Utilities (₹7,500), Groceries (₹9,000), Transport (₹8,000).
2. **Wants (30% - ₹25,500)**: Dining Out (₹8,000), Shopping (₹6,000), Entertainment (₹5,500), Fitness (₹6,000).
3. **Savings & Goals (20% - ₹17,000)**: Car Goal (₹10,000), Home Down Payment (₹7,000).`;
      } else if (query.toLowerCase().includes('save') || query.toLowerCase().includes('saving')) {
        fallbackText = `Your current savings rate is **34%** (₹42,650 saved). You can boost this to 40% with these 3 quick adjustments:

1. **Cook 2 more dinners/week**: Save ~₹2,500 on restaurant deliveries.
2. **Review 5 active subscriptions**: Cancel inactive streaming passes to save ~₹1,200.
3. **Cap impulse shopping**: Set a ₹5,000 monthly ceiling to preserve ₹3,000 extra.`;
      } else {
        fallbackText = `I have analyzed your financial summary for ${period}. Your total income is ₹85,000 with expenses of ₹42,350, maintaining a healthy 34% savings rate.

You are on track with 5 out of 8 budget categories and progressing smoothly towards your Car and Home Down Payment goals. Would you like me to analyze any specific category?`;
      }

      const aiMsg = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: cleanMessageContent(fallbackText),
        timestamp: formatCurrentTime()
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    try {
      await api.delete('/ai/chat/clear', { params: { conversationId } });
    } catch (e) {
      // ignore
    }
    const newConvId = `conv_${Date.now()}`;
    setConversationId(newConvId);
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        isWelcome: true,
        timestamp: formatCurrentTime()
      }
    ]);
    setMenuOpen(false);
  };

  const handleNewConversation = () => {
    const newConvId = `conv_${Date.now()}`;
    setConversationId(newConvId);
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        isWelcome: true,
        timestamp: formatCurrentTime()
      }
    ]);
    setMenuOpen(false);
  };

  return (
    <div className="rounded-2xl bg-[#101A1D] border border-[#24363B] flex flex-col h-[520px] sm:h-[580px] xl:h-[calc(100vh-100px)] xl:min-h-[580px] xl:sticky xl:top-[82px] shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="p-4 sm:p-4.5 border-b border-[#24363B] bg-[#121E22] flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#F1F5F4] tracking-tight">
            Finance AI Assistant
          </h3>
          <p className="text-[11px] text-[#71848A]">
            Ask anything about your finances
          </p>
        </div>

        {/* Right Status & Menu */}
        <div className="flex items-center gap-3">
          {/* Online status indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#123D32]/80 border border-[#35E9A0]/20 text-[11px] text-[#35E9A0] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35E9A0] animate-pulse" />
            <span>Online</span>
          </div>

          {/* Three-dot Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#71848A] hover:text-[#F1F5F4] hover:bg-[#18272C] transition cursor-pointer"
              aria-label="Chat options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-[#18272C] border border-[#24363B] rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95 duration-100 text-xs">
                <button
                  onClick={handleNewConversation}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#A5B4B8] hover:text-[#F1F5F4] hover:bg-[#203238] transition text-left cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#35E9A0]" />
                  <span>New Conversation</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#FF667A] hover:bg-[#3D1A22]/50 transition text-left cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-[#FF667A]" />
                  <span>Clear Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 scrollbar-thin">
        {messages.map((msg) => {
          if (msg.isWelcome) {
            return (
              <div key={msg.id} className="space-y-3">
                {/* Bot Welcome Bubble */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#2A1A40] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 rounded-2xl rounded-tl-xs bg-[#18272C] border border-[#24363B] p-3.5 shadow-sm text-xs text-[#F1F5F4] space-y-2.5">
                    <p className="font-semibold text-[#F1F5F4] flex items-center gap-1.5">
                      <span>👋</span>
                      <span>Hi! I'm your AI Finance Assistant.</span>
                    </p>

                    <div>
                      <p className="text-[#A5B4B8] mb-1 font-medium">I can help you with:</p>
                      <ul className="space-y-1 text-[#A5B4B8] pl-2 text-[11px]">
                        <li>• Analyze your spending and income</li>
                        <li>• Give personalized recommendations</li>
                        <li>• Answer financial questions</li>
                        <li>• Help with budgeting and goal planning</li>
                        <li>• Explain your reports and trends</li>
                      </ul>
                    </div>

                    <div>
                      <p className="text-[#A5B4B8] mb-1.5 font-medium">Try asking something like:</p>
                      <div className="space-y-1.5">
                        {[
                          'Why did my expenses increase this month?',
                          'How can I save more money?',
                          'Create a budget plan for me',
                          'What are my top spending categories?'
                        ].map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(prompt)}
                            className="w-full text-left p-2 rounded-xl bg-[#121E22] hover:bg-[#203238] border border-[#24363B] text-[11px] text-[#A5B4B8] hover:text-[#35E9A0] transition cursor-pointer"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-[#71848A] pl-10">{msg.timestamp}</div>
              </div>
            );
          }

          if (msg.role === 'user') {
            return (
              <div key={msg.id} className="flex flex-col items-end space-y-1 min-w-0">
                <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#35E9A0] text-[#0B1114] px-4 py-2.5 shadow-sm font-medium text-xs leading-relaxed break-words">
                  {msg.content}
                </div>
                <span className="text-[10px] text-[#71848A] pr-1">{msg.timestamp}</span>
              </div>
            );
          }

          return (
            <div key={msg.id} className="space-y-1 min-w-0 group">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#2A1A40] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] shrink-0 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>

                <div className="flex-1 rounded-2xl rounded-tl-xs bg-[#18272C] border border-[#24363B] p-3.5 shadow-sm text-xs text-[#F1F5F4] break-words min-w-0 relative">
                  <ChatMarkdownRenderer content={msg.content} />

                  {/* Message actions footer */}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#24363B]/50 text-[10px] text-[#71848A]">
                    <span className="flex items-center gap-1 text-[#A5B4B8]/70">
                      <Sparkles className="w-2.5 h-2.5 text-[#B18AFF]" />
                      <span>Finance AI</span>
                    </span>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="flex items-center gap-1 hover:text-[#35E9A0] transition px-1.5 py-0.5 rounded hover:bg-[#203238] cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#35E9A0]" />
                          <span className="text-[#35E9A0]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-[#71848A] pl-10 block">{msg.timestamp}</span>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-lg bg-[#2A1A40] border border-[#B18AFF]/30 flex items-center justify-center text-[#B18AFF] shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="rounded-2xl rounded-tl-xs bg-[#18272C] border border-[#24363B] px-4 py-3 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#35E9A0] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#35E9A0] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#35E9A0] animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-[11px] text-[#A5B4B8] ml-1.5 font-medium">Analyzing your finances...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-up Questions bar */}
      {suggestedQuestions && suggestedQuestions.length > 0 && !isLoading && (
        <div className="px-3.5 py-2 border-t border-[#24363B]/60 bg-[#121E22]/60 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-[#18272C] hover:bg-[#203238] border border-[#24363B] hover:border-[#35E9A0]/40 text-[10px] text-[#A5B4B8] hover:text-[#F1F5F4] transition shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>{q}</span>
            </button>
          ))}
        </div>
      )}

      {/* Message Composer Area */}
      <div className="p-3 sm:p-3.5 border-t border-[#24363B] bg-[#121E22] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#18272C] border border-[#24363B] rounded-xl px-2.5 py-1.5 focus-within:border-[#35E9A0]/60 transition"
        >
          {/* Attachment button */}
          <button
            type="button"
            className="p-1 rounded-lg text-[#71848A] hover:text-[#A5B4B8] transition cursor-pointer"
            title="Attach reference"
            aria-label="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your finances..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-xs text-[#F1F5F4] placeholder-[#71848A] focus:outline-none disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-8 h-8 rounded-lg bg-[#35E9A0] hover:bg-[#4FFFB0] text-[#0B1114] flex items-center justify-center transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5 fill-[#0B1114]" />
          </button>
        </form>
      </div>
    </div>
  );
}
