import React, { useState } from "react";
import axios from "axios";
import "../components/AIAssistant.css";
import ReactMarkdown from "react-markdown";

const AIAssistant = () => {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [chat, setChat] = useState([
    {
      role: "assistant",
      content: "Hello 👋 I'm SmartLearn AI. How can I help you today?"
    }
  ]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      content: message
    };

    setChat(prev => [...prev, userMessage]);
    setLoading(true);

    try {

      const res = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message
        }
      );

      setChat(prev => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply
        }
      ]);

    } catch (err) {

      setChat(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong."
        }
      ]);

    }

    setMessage("");
    setLoading(false);

  };

  return (

    <div className="ai-page">

      <div className="chat-header">
        <h2>🤖 SmartLearn AI Assistant</h2>
      </div>

      <div className="chat-body">

        {chat.map((msg, index) => (

            <div
                key={index}
                className={
                msg.role === "user"
                ? "user-message"
                : "ai-message"
                }
            >

                {
                msg.role === "assistant"
                ? (
                    <ReactMarkdown>
                        {msg.content}
                    </ReactMarkdown>
                    )
                : (
                    msg.content
                    )
                }

            </div>

            ))}

        {loading && (
          <div className="ai-message">
            Thinking...
          </div>
        )}

      </div>

      <div className="chat-input">

        <input
          type="text"
          placeholder="Ask anything..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button onClick={sendMessage}>
          Send
        </button>

      </div>

    </div>

  );

};

export default AIAssistant;