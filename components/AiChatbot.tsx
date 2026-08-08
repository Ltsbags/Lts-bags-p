'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Trash2, 
  MessageCircle, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  isLeadForm?: boolean;
  leadSuccess?: boolean;
  leadRefId?: string;
}

const SUGGESTED_QUESTIONS = [
  '📦 What is your Minimum Order Quantity (MOQ)?',
  '🎨 Custom logo printing & embroidery options?',
  '🎒 Explore Executive & Laptop Backpacks',
  '🏭 Where is your factory located?',
  '📑 Request a Bulk Quotation',
  '✈ Global export & shipping process?'
];

const INITIAL_WELCOME_MSG: ChatMessage = {
  id: 'welcome-1',
  sender: 'bot',
  text: 'Hello! 👋 Welcome to LTS BAGS PRIVATE LIMITED. I am your AI Factory Assistant.\n\nI can help you with product catalog specs, custom logo branding, MOQs, materials, and wholesale quotations. How can I assist your business today?',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

const generateUniqueId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export default function AiChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');

  // Lazy state initialization to satisfy ESLint set-state-in-effect rule
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lts_bags_ai_chat_messages');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Ignore fallback
      }
    }
    return [INITIAL_WELCOME_MSG];
  });

  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [contactPhone, setContactPhone] = useState('+919833598338');

  // Lead Form State
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadMobile, setLeadMobile] = useState('');
  const [leadProduct, setLeadProduct] = useState('');
  const [leadQuantity, setLeadQuantity] = useState('200');
  const [leadMessage, setLeadMessage] = useState('');
  const [submittingLead, setSubmittingLead] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch contact settings for WhatsApp link
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data?.contactInfo?.socialWhatsapp || data?.contactInfo?.phone1) {
          const ph = data.contactInfo.socialWhatsapp || data.contactInfo.phone1;
          setContactPhone(ph.replace(/[^\d+]/g, ''));
        }
      })
      .catch(() => {});
  }, []);

  // Sync messages to LocalStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('lts_bags_ai_chat_messages', JSON.stringify(messages));
      } catch {
        // Ignore
      }
    }
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, showLeadForm, loading]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || loading) return;

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: generateUniqueId('user'),
      sender: 'user',
      text: textToSend,
      timestamp: timestampStr,
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputMessage('');
    setLoading(true);

    try {
      const apiMessages = newHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const replyText = data.reply || 'Thank you! For urgent quotation requirements, please contact direct sales at +91 98335 98338.';

      const botMsg: ChatMessage = {
        id: generateUniqueId('bot'),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);

      // Trigger lead form if user asks for quote or price
      const lower = textToSend.toLowerCase();
      if (
        lower.includes('quote') || 
        lower.includes('order') || 
        lower.includes('sample') ||
        lower.includes('price')
      ) {
        setShowLeadForm(true);
      }
    } catch (err) {
      console.error('Chat submit error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: generateUniqueId('err'),
          sender: 'bot',
          text: 'I am experiencing a temporary connection issue. You can click "Request Quote" above to leave your details or reach our sales team directly on WhatsApp!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || (!leadEmail && !leadMobile)) {
      alert('Please provide your Name and at least Email or Mobile Number.');
      return;
    }

    setSubmittingLead(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_lead',
          lead: {
            name: leadName,
            company: leadCompany,
            email: leadEmail,
            mobile: leadMobile,
            productRequirement: leadProduct || 'Custom Bulk Bag Enquiry',
            quantity: leadQuantity,
            message: leadMessage || 'Submitted via AI Support Chatbot',
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        const leadRef = data.enquiryId || 'LTS-' + (Date.now() % 10000);
        setShowLeadForm(false);
        
        // Reset form
        setLeadName('');
        setLeadCompany('');
        setLeadEmail('');
        setLeadMobile('');
        setLeadProduct('');
        setLeadMessage('');

        // Append confirmation to chat
        const confirmMsg: ChatMessage = {
          id: generateUniqueId('lead-confirm'),
          sender: 'bot',
          text: `✅ **Thank You! Your Quotation Request has been saved.**\n\n- **Reference ID:** \`${leadRef}\`\n- **Product Requirement:** ${leadProduct || 'Bulk Custom Bags'}\n- **Target Volume:** ${leadQuantity} units\n\nOur sales engineering team will review your specs and email/call you within 24 hours with custom factory pricing!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          leadSuccess: true,
          leadRefId: leadRef,
        };
        setMessages(prev => [...prev, confirmMsg]);
      } else {
        alert(data.error || 'Failed to submit quote request. Please try again.');
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      alert('Error submitting inquiry. Please try again.');
    } finally {
      setSubmittingLead(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear entire chat conversation history?')) {
      const initial: ChatMessage[] = [
        {
          id: generateUniqueId('welcome-reset'),
          sender: 'bot',
          text: 'Chat cleared. 👋 How can LTS BAGS AI Support assist your factory order today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
      setMessages(initial);
      localStorage.removeItem('lts_bags_ai_chat_messages');
      setShowLeadForm(false);
    }
  };

  const cleanWhatsappNumber = contactPhone.replace(/[^\d]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    'Hello LTS BAGS Sales Team, I am inquiring about custom bag manufacturing via AI Chatbot.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto print:hidden font-sans">
      
      {/* Expanded Chat Dialog Window */}
      {isOpen && (
        <div 
          className={`bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized 
              ? 'w-80 h-16 mb-3' 
              : 'w-full sm:w-[420px] h-[600px] max-h-[85vh] mb-3'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-amber-500 p-0.5 flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-sky-400" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm tracking-tight font-serif">LTS BAGS AI Support</h3>
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                    Factory AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Instant Database Answers & Bulk Quotes</span>
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open WhatsApp Support"
                className="p-1.5 hover:bg-emerald-600/20 text-emerald-400 hover:text-emerald-300 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowLeadForm(!showLeadForm)}
                title="Request Bulk Quote"
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  showLeadForm
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quote</span>
              </button>

              <button
                onClick={handleClearChat}
                title="Clear Chat History"
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Maximize' : 'Minimize'}
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Main Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
                
                {/* Messages Stream */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-sky-600 text-white rounded-br-none'
                          : msg.leadSuccess
                          ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-100 rounded-bl-none'
                          : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed font-normal text-xs">
                        {msg.text}
                      </div>
                      <div className={`text-[10px] text-right font-mono ${
                        msg.sender === 'user' ? 'text-sky-200' : 'text-slate-400'
                      }`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-3.5 rounded-bl-none flex items-center gap-2 text-slate-400">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                      <span className="text-xs font-mono">Searching factory catalog database...</span>
                    </div>
                  </div>
                )}

                {/* In-Chat Interactive Lead Collector Form Drawer */}
                {showLeadForm && (
                  <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 shadow-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <FileText className="w-4 h-4" />
                        <span className="font-serif text-sm">Submit Wholesale Quote Lead</span>
                      </div>
                      <button
                        onClick={() => setShowLeadForm(false)}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <form onSubmit={handleLeadSubmit} className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                          Customer Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Verma"
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                            Company Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Infosys / TCS"
                            value={leadCompany}
                            onChange={(e) => setLeadCompany(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                            Mobile Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={leadMobile}
                            onChange={(e) => setLeadMobile(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="rahul@company.com"
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                            Target Quantity
                          </label>
                          <input
                            type="number"
                            min="10"
                            placeholder="200"
                            value={leadQuantity}
                            onChange={(e) => setLeadQuantity(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                          Product Interested In
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1680D Executive Laptop Backpack / Leatherette Briefcase"
                          value={leadProduct}
                          onChange={(e) => setLeadProduct(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
                          Custom Message / Branding Specs
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Specific fabric, logo embroidery, or target budget details..."
                          value={leadMessage}
                          onChange={(e) => setLeadMessage(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingLead}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
                      >
                        {submittingLead ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Saving Quote Lead...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Submit Factory Quote Request</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Suggested Questions Pills */}
                {messages.length <= 2 && !showLeadForm && (
                  <div className="pt-2 space-y-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Suggested Questions:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_QUESTIONS.map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(q)}
                          className="bg-slate-800/80 hover:bg-sky-600/30 text-sky-300 hover:text-sky-100 border border-sky-500/20 hover:border-sky-400/50 rounded-xl px-2.5 py-1.5 text-[11px] font-medium transition-all text-left"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Quick Action Bar & Input */}
              <div className="bg-slate-950 border-t border-slate-800 p-3 space-y-2 shrink-0">
                <div className="flex items-center justify-between text-[11px] px-1">
                  <button
                    onClick={() => setShowLeadForm(true)}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Request Bulk Quote</span>
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Sales</span>
                  </a>
                </div>

                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 focus-within:border-sky-400 transition-colors">
                  <input
                    type="text"
                    placeholder="Ask about bag specs, MOQs, materials..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={loading}
                    className="w-full bg-transparent text-white text-xs outline-none placeholder:text-slate-500"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={loading || !inputMessage.trim()}
                    className="p-1.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg transition-all shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open LTS BAGS AI Customer Support Chatbot"
          className="group relative flex items-center gap-2 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:scale-105 border-2 border-sky-400/40 hover:border-amber-400 transition-all duration-300 shadow-sky-500/20"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-amber-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-sky-400 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
          </div>

          <div className="text-left">
            <span className="block font-serif font-bold text-xs text-white tracking-tight">
              AI Support & Quotes
            </span>
            <span className="block text-[10px] text-sky-300 font-mono flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Instant AI Catalog Help</span>
            </span>
          </div>

          <div className="ml-1 px-2 py-0.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-extrabold rounded-full font-mono uppercase">
            Ask
          </div>
        </button>
      )}

    </div>
  );
}
