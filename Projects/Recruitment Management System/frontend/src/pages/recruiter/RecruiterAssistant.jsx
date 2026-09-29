import { useState } from 'react';
import api from '../../services/api';
import { Send, Bot } from 'lucide-react';

const RecruiterAssistant = () => {
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hi! Ask me anything about your current jobs or candidates.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/assistant/ask', { question: input });
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error answering your question.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-indigo-50 flex items-center gap-3">
        <Bot className="text-indigo-600 w-8 h-8" />
        <h2 className="text-xl font-bold text-gray-800">Recruiter AI Assistant</h2>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
              <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-500 rounded-lg rounded-bl-none p-3 text-sm flex gap-2 items-center">
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
        <input 
          type="text" 
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          placeholder="Ask about candidates or jobs..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default RecruiterAssistant;
