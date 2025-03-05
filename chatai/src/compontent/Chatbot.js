import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPublishOptions, setShowPublishOptions] = useState(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);

    const appendMessage = (sender, text) => {
        setMessages(prev => [...prev, { sender, text }]);
    };

    const sendMessage = async () => {
        if (!input && !selectedFile) return;
        
        appendMessage("user", input || "File Sent");
        
        const formData = new FormData();
        formData.append("msg", input);
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        setInput("");
        setSelectedFile(null);

        try {
            const response = await fetch("http://localhost:5000/get", {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" },
            });
            const data = await response.text();
            appendMessage("model", data);
        } catch (error) {
            appendMessage("model", "Failed to fetch response.");
        }
    };

    const copyAndRedirect = async (platform, text) => {
        try {
            await navigator.clipboard.writeText(text);
            if (platform === "LinkedIn") {
                window.open("https://www.linkedin.com/article/new/", "_blank");
            } else if (platform === "Medium") {
                window.open("https://medium.com/new-story", "_blank");
            }
        } catch (error) {
            alert("Failed to copy text. Please copy manually.");
        }
    };

    return (
        <div className="chat-container">
            {/* <div className="header">
                <img src="https://i.ibb.co/F57MGN0/ai-1.png" alt="Chatbot Logo" />
                
            </div> */}
            <div className="header">
    <img src="https://i.ibb.co/F57MGN0/ai-1.png" alt="Chatbot Logo" />
    <span className="chat-title">Chatbot Application</span>
</div>
            <div className="chat-box" ref={chatContainerRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                       <img
                        src={msg.sender === "user" ? "/assets/user.png" : "/assets/bot.png"}
                         alt={msg.sender}
                        className="chat-logo"
                        style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                        />
                        <div className="msg-content">
                            <div className="msg-header">{msg.sender.toUpperCase()}</div>
                            <div className="msg-body">{msg.text}</div>
                        </div>
                        {msg.sender === "model" && (
                            <div>
                                <button onClick={() => setShowPublishOptions(index)}>Publish</button>
                                {showPublishOptions === index && (
                                    <div className="publish-options">
                                        <button onClick={() => copyAndRedirect("LinkedIn", msg.text)}>LinkedIn</button>
                                        <button onClick={() => copyAndRedirect("Medium", msg.text)}>Medium</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="footer">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything" />
                <label className="custom-file-upload">
    <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
    📂 Choose File
</label>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
