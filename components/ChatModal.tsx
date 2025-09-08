import React, { useState } from 'react';
import clsx from 'clsx';
import OpenAI from 'openai';
import { CloseIcon, SendIcon } from './icons';

// Safely get the API key from environment variables
const getApiKey = (): string => {
  // Type assertion to access Vite's environment variables
  const env = import.meta.env as unknown as {
    VITE_OPENAI_API_KEY: string;
    [key: string]: string | undefined;
  };
  return env.VITE_OPENAI_API_KEY || '';
};

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: getApiKey(),
  dangerouslyAllowBrowser: true // Only use this in the browser if you're sure it's safe
});

interface Message {
    sender: 'user' | 'ai';
    text: string | React.ReactNode;
    isError?: boolean;
}

interface ChatModalProps {
    onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const prompt = input;
        const userMessage: Message = { sender: 'user', text: prompt };

        setInput('');
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: prompt }
                ]
            });

            const aiResponse: Message = {
                sender: 'ai',
                text: completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error: any) {
            console.error("Error generating content:", error);
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            if (error?.status === 429) {
                errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
            } else if (error?.message?.includes('quota')) {
                errorMessage = 'API quota exceeded. Please check your OpenAI account billing and quota settings.';
            } else if (error?.message) {
                errorMessage = `Error: ${error.message}`;
            }
            
            const errorResponse: Message = {
                sender: 'ai',
                text: errorMessage,
                isError: true
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content chat-modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>GenAI Stack Chat</h2>
                    <button className="close-btn" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="chat-modal-body">
                    <div className="chat-messages">
                        {messages.length === 0 ? (
                            <div className="chat-start">
                                <div className="logo-icon"></div>
                                <h3>GenAI Stack Chat</h3>
                                <p>Start a conversation to test your stack</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                                    <div className={clsx('message-avatar', msg.sender === 'user' ? 'user-avatar' : 'ai-avatar')}>
                                        {msg.sender === 'user' ? 'S' : <div className="logo-icon" style={{ background: 'white', width: 20, height: 20 }}></div>}
                                    </div>
                                    <div className="message-content">
                                        {msg.text}
                                        {msg.isError && (
                                            <div className="error-message">
                                                <p>If this issue persists, please:</p>
                                                <ol>
                                                    <li>Check your <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer">OpenAI billing</a></li>
                                                    <li>Try again in a few minutes</li>
                                                    <li>Contact support if the problem continues</li>
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className={clsx('message', 'ai')}>
                                <div className={clsx('message-avatar', 'ai-avatar')}>
                                    <div className="logo-icon" style={{ background: 'white', width: 20, height: 20 }}></div>
                                </div>
                                <div className="message-content">Thinking...</div>
                            </div>
                        )}
                    </div>
                    <div className="chat-input-area">
                        <div className="chat-input-wrapper">
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Send a message"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isLoading}><SendIcon /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};