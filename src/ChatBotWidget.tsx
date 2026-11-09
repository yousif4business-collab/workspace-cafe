import { useEffect, useRef, useState, type FormEvent } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatBotWidgetProps = {
  lang: 'en' | 'ar';
};

const CHAT_RATE_LIMIT_KEY = 'workspace_chat_sent_timestamps';
const CHAT_RATE_LIMIT_WINDOW_MS = 60_000;
const CHAT_RATE_LIMIT_MAX_MESSAGES = 5;

function loadRecentMessageTimestamps() {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(CHAT_RATE_LIMIT_KEY) ?? '[]');
    if (!Array.isArray(stored)) return [];
    const cutoff = Date.now() - CHAT_RATE_LIMIT_WINDOW_MS;
    return stored.filter((timestamp): timestamp is number =>
      typeof timestamp === 'number' && Number.isFinite(timestamp) && timestamp > cutoff
    );
  } catch (error) {
    console.warn('Unable to read chat rate-limit history:', error);
    return [];
  }
}

const copy = {
  en: {
    title: 'WorkSpace Assistant',
    greeting: 'Hi! Ask me about our cafe, padel court, meeting room, or business suites.',
    placeholder: 'Ask a question...',
    send: 'Send message',
    open: 'Open WorkSpace chat',
    close: 'Close chat',
    error: 'I could not get a response right now. Please try again or contact us on WhatsApp.',
    waiting: 'Thinking...',
    rateLimit: 'Please wait before sending another message.',
  },
  ar: {
    title: 'مساعد وورك سبيس',
    greeting: 'مرحباً! اسألني عن المقهى أو ملعب البادل أو قاعة الاجتماعات أو أجنحة الأعمال.',
    placeholder: 'اكتب سؤالك...',
    send: 'إرسال الرسالة',
    open: 'افتح محادثة وورك سبيس',
    close: 'إغلاق المحادثة',
    error: 'تعذر الحصول على إجابة الآن. حاول مجدداً أو تواصل معنا عبر واتساب.',
    waiting: 'جارٍ التفكير...',
    rateLimit: 'يرجى الانتظار قبل إرسال رسالة أخرى.',
  },
};

export default function ChatBotWidget({ lang }: ChatBotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [sentTimestamps, setSentTimestamps] = useState<number[]>(loadRecentMessageTimestamps);
  const [rateLimitUntil, setRateLimitUntil] = useState(0);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const text = copy[lang];
  const isRateLimited = rateLimitUntil > 0;

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  useEffect(() => {
    if (!isRateLimited) return;
    const timeout = window.setTimeout(() => setRateLimitUntil(0), Math.max(0, rateLimitUntil - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [isRateLimited, rateLimitUntil]);

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || isSending || isRateLimited) return;

    const now = Date.now();
    const recentTimestamps = sentTimestamps.filter((timestamp) => timestamp > now - CHAT_RATE_LIMIT_WINDOW_MS);
    if (recentTimestamps.length >= CHAT_RATE_LIMIT_MAX_MESSAGES) {
      setSentTimestamps(recentTimestamps);
      setRateLimitUntil(recentTimestamps[0] + CHAT_RATE_LIMIT_WINDOW_MS);
      return;
    }

    const nextTimestamps = [...recentTimestamps, now];
    setSentTimestamps(nextTimestamps);
    try {
      localStorage.setItem(CHAT_RATE_LIMIT_KEY, JSON.stringify(nextTimestamps));
    } catch (error) {
      console.error('Unable to persist chat rate-limit history:', error);
    }

    const nextMessages = [...messages, { role: 'user' as const, content }];
    const requestMessages = nextMessages.slice(-8);
    while (
      requestMessages.length > 1 &&
      requestMessages.reduce((total, message) => total + message.content.length, 0) > 6000
    ) {
      requestMessages.shift();
    }
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);
    setHasError(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: requestMessages }),
      });
      if (!response.ok) throw new Error(`Chat request failed (${response.status})`);

      const result: unknown = await response.json();
      if (
        typeof result !== 'object' ||
        result === null ||
        !('answer' in result) ||
        typeof result.answer !== 'string'
      ) {
        throw new Error('Chat service returned an invalid response');
      }
      const answer = result.answer;
      if (!answer.trim()) throw new Error('Chat service returned an empty response');

      setMessages((current) => [...current, { role: 'assistant' as const, content: answer }].slice(-10));
    } catch (error) {
      console.error('Unable to complete chat request:', error);
      setHasError(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="relative h-14 w-14">
      {isOpen && (
        <section
          aria-label={text.title}
          className="absolute bottom-[calc(100%+1rem)] right-0 flex h-[min(32rem,70vh)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#181615] shadow-2xl sm:w-96"
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-[#211e1c] px-4 py-3">
            <h2 className="font-semibold text-white">{text.title}</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={text.close}
              className="rounded-full p-2 text-stone-300 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 && (
              <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white/10 px-3 py-2.5 text-sm leading-relaxed text-stone-100">
                {text.greeting}
              </p>
            )}
            {messages.map((message, index) => (
              <p
                key={`${index}-${message.role}`}
                dir="auto"
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'ms-auto rounded-tr-sm bg-[#C85228] text-white'
                    : 'me-auto rounded-tl-sm bg-white/10 text-stone-100'
                }`}
              >
                {message.content}
              </p>
            ))}
            {isSending && <p className="text-xs text-stone-400">{text.waiting}</p>}
            {isRateLimited && <p role="status" className="text-xs leading-relaxed text-amber-300">{text.rateLimit}</p>}
            {hasError && <p role="alert" className="text-xs leading-relaxed text-amber-300">{text.error}</p>}
            <div ref={endOfMessagesRef} />
          </div>

          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1000}
              disabled={isRateLimited}
              placeholder={isRateLimited ? text.rateLimit : text.placeholder}
              aria-label={text.placeholder}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-[#C85228] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending || isRateLimited || !input.trim()}
              aria-label={text.send}
              className="rounded-full bg-[#C85228] p-3 text-white transition-colors hover:bg-[#d95d31] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={text.open}
          aria-expanded={isOpen}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#C85228] text-white shadow-xl transition-transform hover:scale-105"
        >
          <MessageCircle size={23} />
        </button>
      )}
    </div>
  );
}
