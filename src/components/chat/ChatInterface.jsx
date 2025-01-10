import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Loader, Copy, RefreshCw, CheckCircle } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

// User Avatar Component
const UserAvatar = ({ name, email, size = 'md' }) => {
  const initial = name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : 'U';
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold`}>
      {initial}
    </div>
  );
};

// DM Avatar Component
const DmAvatar = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold`}>
      DM
    </div>
  );
};

// Message Content Component
const MessageContent = ({ content, isStreaming }) => {
  // Helper function to process various markdown-style formatting
  const processInlineFormatting = (text) => {
    return text.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const formatContent = (text) => {
    // Split content into blocks based on double newlines for paragraphs
    const blocks = text.split(/\n\n+/);
    
    return blocks.map((block, blockIndex) => {
      const lines = block.split('\n');
      
      // Headers (multiple levels)
      if (lines[0].match(/^#{1,6}\s/)) {
        const level = lines[0].match(/^#+/)[0].length;
        const content = lines[0].replace(/^#+\s/, '');
        const className = `text-${level === 1 ? '2xl' : level === 2 ? 'xl' : 'lg'} font-bold my-4`;
        return <div key={blockIndex} className={className}>{processInlineFormatting(content)}</div>;
      }
      
      // Bullet lists
      if (lines.every(line => line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*'))) {
        return (
          <ul key={blockIndex} className="my-4 space-y-2">
            {lines.map((line, i) => (
              <li key={i} className="flex space-x-2">
                <span className="text-gray-400">•</span>
                <span className="flex-1">{processInlineFormatting(line.replace(/^[•\-*]\s*/, ''))}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      // Numbered lists
      if (lines.every(line => line.trim().match(/^\d+\./))) {
        return (
          <ol key={blockIndex} className="my-4 list-decimal list-inside space-y-2">
            {lines.map((line, i) => (
              <li key={i} className="pl-2">{processInlineFormatting(line.replace(/^\d+\.\s*/, ''))}</li>
            ))}
          </ol>
        );
      }
      
      // Code blocks
      if (block.startsWith('```')) {
        const code = block.replace(/```(\w+)?\n/, '').replace(/```$/, '');
        return (
          <pre key={blockIndex} className="bg-gray-50 rounded-lg p-4 my-4 overflow-x-auto">
            <code className="text-sm font-mono text-gray-800">{code}</code>
          </pre>
        );
      }
      
      // Regular paragraphs
      return (
        <p key={blockIndex} className="my-4 leading-relaxed">
          {processInlineFormatting(block)}
        </p>
      );
    });
  };

  return (
    <div className="prose max-w-none text-gray-800">
      {formatContent(content)}
      {isStreaming && (
        <div className="flex space-x-1 mt-2">
          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
          <div className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        </div>
      )}
    </div>
  );
};

// Message Actions Component
const MessageActions = ({ content, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={copyToClipboard} className="flex items-center space-x-1 text-gray-500 hover:text-black text-sm bg-white/50 px-2 py-1 rounded">
        {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
      </button>
      {onRegenerate && (
        <button onClick={onRegenerate} className="flex items-center space-x-1 text-gray-500 hover:text-black text-sm bg-white/50 px-2 py-1 rounded">
          <RefreshCw className="w-3 h-3" />
          <span className="text-xs">Regenerate</span>
        </button>
      )}
    </div>
  );
};

// Main Chat Interface Component
export function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Get user info from localStorage
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const streamResponse = async (response) => {
    setStreaming(true);
    const words = response.split(" ");
    let currentText = "";

    for (let i = 0; i < words.length; i++) {
      currentText += words[i] + " ";
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { type: "bot", content: currentText.trim() };
        return newMessages;
      });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    setStreaming(false);
  };

  const regenerateLastResponse = async () => {
    if (messages.length < 2) return;
    const lastUserMessage = messages.filter(m => m.type === "user").pop();
    if (!lastUserMessage) return;
    
    setMessages(messages.slice(0, -1));
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/chat", 
        { query: lastUserMessage.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setMessages(prev => [...prev, { type: "bot", content: "" }]);
        await streamResponse(response.data.answer);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/chat/",
        { query: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setMessages((prev) => [...prev, { type: "bot", content: "" }]);
        await streamResponse(response.data.answer);
      }
    } catch (error) {
      console.error("Chat error:", error);
      
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
        setMessages((prev) => prev.slice(0, -1));
      } else if (error.response?.status === 400) {
        setError("Please upload a document before starting the chat.");
        setMessages((prev) => prev.slice(0, -1));
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 text-black" />
            <h1 className="text-lg font-medium text-gray-900">DocMind Chat</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-3 text-sm font-medium text-gray-900">No messages yet</h3>
              <p className="mt-1 text-xs text-gray-500">Start a conversation about your document</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex items-start space-x-4 group ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className="flex-shrink-0">
                  {message.type === "user" ? (
                    <UserAvatar name={userName} email={userEmail} size="md" />
                  ) : (
                    <DmAvatar size="md" />
                  )}
                </div>
                <div className={`relative max-w-2xl rounded-xl px-6 py-4 text-sm ${
                  message.type === "user" 
                    ? "bg-gray-100 text-gray-900" 
                    : "bg-white border border-gray-200 shadow-md"
                }`}>
                  <MessageContent 
                    content={message.content} 
                    isStreaming={streaming && index === messages.length - 1} 
                  />
                  {message.type === "bot" && (
                    <MessageActions 
                      content={message.content}
                      onRegenerate={index === messages.length - 1 ? regenerateLastResponse : null}
                    />
                  )}
                </div>
              </div>
            ))
          )}
          {loading && !streaming && (
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm">
                <Loader className="w-3 h-3 animate-spin" />
                <span>Processing...</span>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center text-xs text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-white p-6">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={sendMessage} className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your document..."
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex items-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}

export default ChatInterface;