import React, { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  screenshotUrl?: string;
}

interface ChatWindowProps {
  personalityId: string;
}

export function ChatWindow({ personalityId }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Load conversation history for this personality
    loadConversationHistory();
  }, [personalityId]);

  const loadConversationHistory = async () => {
    // This would load from the database
    // Placeholder implementation
    setMessages([]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send message to backend through IPC
      // This is a placeholder - real implementation would use window.ipcRenderer
      const response = await new Promise<string>(resolve => {
        setTimeout(() => resolve('How can I help you today? 🌟'), 1000);
      });

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_response`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>👋 Hi! I'm ready to chat. What's on your mind?</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`chat-message chat-message-${message.role}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? '👤' : '✨'}
              </div>
              <div className="message-content">
                <p>{message.content}</p>
                {message.screenshotUrl && (
                  <img
                    src={message.screenshotUrl}
                    alt="Screenshot context"
                    className="message-screenshot"
                  />
                )}
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="chat-message chat-message-assistant">
            <div className="message-avatar">✨</div>
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={isLoading || !input.trim()}
        >
          Send ✨
        </button>
      </form>
    </div>
  );
}
