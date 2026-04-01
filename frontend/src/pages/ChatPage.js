import React, { useState } from "react";

function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { sender: "system", text: "Welcome to the mentorship chat! Start the conversation below." }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChatLog([...chatLog, { sender: "user", text: message }]);
    setMessage("");
    
    // Simulate a quick auto-reply for the hackathon demo
    setTimeout(() => {
      setChatLog(prev => [...prev, { sender: "mentor", text: "Thanks for reaching out! I'll review your request and get back to you shortly." }]);
    }, 1500);
  };

  return (
    <div className="container mt-4">
      <div className="card modern-card overflow-hidden" style={{ height: "70vh", display: "flex", flexDirection: "column" }}>
        
        {/* Chat Header */}
        <div className="bg-dark text-white p-3 d-flex align-items-center">
          <div className="avatar-circle bg-primary me-3 text-white" style={{ width: "40px", height: "40px", fontSize: "1rem" }}>M</div>
          <div>
            <h6 className="mb-0 fw-bold">Mentorship Session</h6>
            <small className="text-light opacity-75">Secure Connection</small>
          </div>
        </div>

        {/* Chat Body */}
        <div className="p-4 flex-grow-1" style={{ overflowY: "auto", backgroundColor: "#f8f9fa" }}>
          {chatLog.map((msg, index) => (
            <div key={index} className={`d-flex mb-3 ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}>
              <div 
                className={`p-3 rounded shadow-sm ${msg.sender === "user" ? "bg-primary text-white" : msg.sender === "system" ? "bg-secondary text-white text-center w-100" : "bg-white text-dark"}`}
                style={{ maxWidth: "75%", borderRadius: msg.sender === "user" ? "15px 15px 0 15px" : "15px 15px 15px 0" }}
              >
                <p className="mb-0 small">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-top d-flex gap-2 align-items-center">
          <input
            type="text"
            className="form-control rounded-pill bg-light border-0 px-4"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="btn btn-primary rounded-circle btn-modern d-flex justify-content-center align-items-center" style={{ width: "45px", height: "45px" }} onClick={sendMessage}>
            <i className="bi bi-send-fill"></i>
          </button>
        </div>

      </div>
    </div>
  );
}

export default ChatPage;