import re

file_path = 'app/dashboard/page.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Import ReactMarkdown
if 'import ReactMarkdown' not in content:
    content = content.replace('import { useState, useEffect, useRef } from "react";', 'import { useState, useEffect, useRef } from "react";\nimport ReactMarkdown from "react-markdown";')

# 2. Update handleSendMessage to handle streaming
old_handle = '''const handleSendMessage = async (customPrompt?: string) => {
    const msg = customPrompt || chatInput;
    if(!msg.trim()) return;
    setChatHistory(prev => [...prev, { role: "user", content: msg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/ai-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: msg, language }) });
      const data = await res.json();
      if(data.success) setChatHistory(prev => [...prev, { role: "assistant", content: data.reply }]);
      else setChatHistory(prev => [...prev, { role: "assistant", content: "Sorry, VPS Brain is currently unreachable." }]);
    } catch (e) { setChatHistory(prev => [...prev, { role: "assistant", content: "Error connecting to AI Brain." }]); }
    setChatLoading(false);
  };'''

new_handle = '''const handleSendMessage = async (customPrompt?: string) => {
    const msg = customPrompt || chatInput;
    if(!msg.trim()) return;
    
    setChatHistory(prev => [...prev, { role: "user", content: msg }]);
    setChatInput("");
    setChatLoading(true);
    setChatHistory(prev => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai-chat", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ prompt: msg, language }) 
      });

      if (!res.body) throw new Error("No stream");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\\n');
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line);
              if (json.response) {
                aiResponse += json.response;
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1] = { role: "assistant", content: aiResponse };
                  return newHistory;
                });
              }
            } catch (e) {}
          }
        }
      }
    } catch (e) {
      setChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { role: "assistant", content: "❌ Error connecting to AI Brain." };
        return newHistory;
      });
    }
    setChatLoading(false);
  };'''
content = content.replace(old_handle, new_handle)

# 3. Replace Chat UI
old_ui = '''{active === "AI tender brain" && (
            <div style={{ ...cardStyle, padding: 0, display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", overflow: "hidden" }}>
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", background: isDarkMode ? "#0f172a" : "#f8fafc" }}>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: 6, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, background: C.card, color: C.text }}><option value="hi">Hindi</option><option value="en">English</option></select>
                <button onClick={() => window.print()} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", color: C.text }}>📄 Download PDF</button>
              </div>
              <div style={{ padding: 20, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                {chatHistory.map((msg, i) => (<div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}><div style={{ background: msg.role === "user" ? C.accent : C.card, color: msg.role === "user" ? "#fff" : C.text, padding: "14px 18px", borderRadius: 16, borderTopRightRadius: msg.role === "user" ? 4 : 16, borderTopLeftRadius: msg.role === "assistant" ? 4 : 16, maxWidth: "85%", fontSize: 14, border: msg.role === "assistant" ? `1px solid ${C.border}` : "none" }}>{msg.content}</div></div>))}
                {chatLoading && <div style={{ color: C.sub, fontSize: 12 }}>BidWell AI is analyzing...</div>}
                <div ref={chatEndRef} />
              </div>
              <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10 }}><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMessage()} placeholder="Ask anything..." style={{ flex: 1, padding: "14px 20px", borderRadius: 24, border: `1px solid ${C.border}`, outline: "none", background: isDarkMode ? "#0f172a" : "#f8fafc", color: C.text }} /><button onClick={() => handleSendMessage()} style={{ background: C.accent, color: "#fff", border: "none", padding: "0 24px", borderRadius: 24, fontWeight: 800, cursor: "pointer" }}>Send</button></div>
            </div>
          )}'''

new_ui = '''{active === "AI tender brain" && (
            <div style={{ ...cardStyle, padding: 0, display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", overflow: "hidden", border: `1px solid ${C.border}` }}>
              
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: isDarkMode ? "#0f172a" : "#f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Language:</span>
                  <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, background: C.card, color: C.text, fontWeight: 600 }}>
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                   <button onClick={() => window.print()} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", color: C.text }}>📄 PDF</button>
                   <button onClick={() => { setChatHistory([{ role: "assistant", content: "Namaste! Main BidWell AI hoon." }]); }} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", color: C.text }}>🗑️ Clear</button>
                </div>
              </div>

              <div style={{ padding: "20px 20px 0 20px", flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, background: isDarkMode ? "#0f172a" : "#fff" }}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "user" ? "#cbd5e1" : C.accent, display: "grid", placeItems: "center", flexShrink: 0, color: "#fff", fontSize: 16, fontWeight: 800 }}>
                      {msg.role === "user" ? "U" : "✳"}
                    </div>
                    <div style={{ background: msg.role === "user" ? (isDarkMode ? "#334155" : "#f1f5f9") : C.card, color: C.text, padding: "12px 16px", borderRadius: 12, borderTopRightRadius: msg.role === "user" ? 2 : 12, borderTopLeftRadius: msg.role === "assistant" ? 2 : 12, maxWidth: "80%", fontSize: 14, lineHeight: 1.6, border: msg.role === "assistant" ? `1px solid ${C.border}` : "none", boxShadow: msg.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.05)" : "none" }}>
                      {msg.role === "user" ? (
                        msg.content
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          {chatLoading && i === chatHistory.length - 1 && (
                            <span style={{ display: "inline-block", width: 6, height: 14, background: C.accent, marginLeft: 4, animation: "blink 1s step-end infinite" }} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} style={{ paddingBottom: 20 }} />
              </div>

              <div style={{ padding: "10px 20px", display: "flex", gap: 8, overflowX: "auto", background: isDarkMode ? "#0f172a" : "#fff", borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => handleSendMessage(language === "hi" ? "Mujhe tender ke liye kaunse documents chahiye?" : "What documents are required?")} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 20, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                  {language === "hi" ? "📄 Zaruri Documents" : "📄 Required Documents"}
                </button>
                <button onClick={() => handleSendMessage(language === "hi" ? "Payment condition kya hai?" : "Payment condition?")} style={{ whiteSpace: "nowrap", padding: "8px 14px", borderRadius: 20, border: `1px solid ${C.border}`, background: C.card, color: C.text, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                  {language === "hi" ? "💰 Payment Info" : "💰 Payment Info"}
                </button>
              </div>

              <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, background: C.card }}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSendMessage()} placeholder={language === "hi" ? "Kuch bhi puchein..." : "Ask anything..."} style={{ flex: 1, padding: "14px 20px", borderRadius: 24, border: `1px solid ${C.border}`, outline: "none", background: isDarkMode ? "#0f172a" : "#f8fafc", color: C.text, fontSize: 14 }} />
                <button onClick={() => handleSendMessage()} disabled={chatLoading} style={{ background: chatLoading ? "#94a3b8" : C.accent, color: "#fff", border: "none", padding: "0 24px", borderRadius: 24, fontWeight: 800, cursor: chatLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  {chatLoading ? "..." : (language === "hi" ? "Bhejein" : "Send")}
                </button>
              </div>
            </div>
          )}'''
content = content.replace(old_ui, new_ui)

# Add CSS style at the end of the return (just before last closing div)
style_tag = '''
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .markdown-content p { margin-bottom: 8px; }
        .markdown-content ul { list-style-type: disc; padding-left: 20px; margin-bottom: 8px; }
        .markdown-content ol { list-style-type: decimal; padding-left: 20px; margin-bottom: 8px; }
        .markdown-content li { margin-bottom: 4px; }
        .markdown-content strong { font-weight: 700; }
        .markdown-content a { color: #3b82f6; text-decoration: underline; }
      `}</style>
    </div>
  );
}'''
content = content.replace('    </div>\n  );\n}', style_tag)

with open(file_path, 'w') as f:
    f.write(content)
print("✅ Frontend UI upgraded for Streaming & Markdown!")
