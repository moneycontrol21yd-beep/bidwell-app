import re

file_path = 'app/dashboard/page.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. FIX THE ROOT LAYOUT (Lock the screen height)
content = content.replace(
    'style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui, sans-serif", display: "flex", color: C.text, transition: "0.3s" }}',
    'style={{ height: "100dvh", width: "100vw", overflow: "hidden", background: C.bg, fontFamily: "system-ui, sans-serif", display: "flex", color: C.text }}'
)

# 2. FIX THE MAIN CONTAINER
content = content.replace(
    '<main style={{ flex: 1, width: "100%", overflowX: "hidden" }}>',
    '<main style={{ flex: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>'
)

# 3. FIX THE INNER PADDING DIV
content = content.replace(
    '<div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>',
    '<div style={{ flex: 1, padding: active === "AI tender brain" ? "0" : "20px", maxWidth: 1200, margin: "0 auto", width: "100%", overflowY: active === "AI tender brain" ? "hidden" : "auto" }}>'
)

# 4. REPLACE CHAT UI WITH PERFECT LAYOUT
chat_start = '{active === "AI tender brain" && ('
chat_end = '          {/* BID WORKSPACE */}'

parts = content.split(chat_start)
if len(parts) > 1:
    before = parts[0]
    after_part = chat_start + parts[1]
    end_parts = after_part.split(chat_end)
    
    if len(end_parts) > 1:
        after = chat_end + end_parts[1]
        
        new_ui = '''{active === "AI tender brain" && (
            <div style={{ height: "calc(100dvh - 75px)", display: "flex", flexDirection: "column", background: isDarkMode ? "#0f172a" : "#fff", borderTop: `1px solid ${C.border}`, overflow: "hidden" }}>
              
              {/* Chat Header */}
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: isDarkMode ? "#1e293b" : "#f8fafc", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, background: C.card, color: C.text, fontWeight: 600, outline: "none" }}>
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                   <button onClick={downloadChatPDF} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", color: C.text }}>📄 PDF</button>
                   <button onClick={() => { setChatHistory([{ role: "assistant", content: "Namaste! Main BidWell AI hoon." }]); }} style={{ background: C.card, border: `1px solid ${C.border}`, padding: "6px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", color: C.text }}>🗑️ Clear</button>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ padding: "20px", flex: 1, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", gap: 16, background: isDarkMode ? "#0f172a" : "#fff" }}>
                {chatHistory.map((msg, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.role === "user" ? "#cbd5e1" : C.accent, display: "grid", placeItems: "center", flexShrink: 0, color: "#fff", fontSize: 16, fontWeight: 800 }}>
                      {msg.role === "user" ? "U" : "✳"}
                    </div>
                    <div style={{ background: msg.role === "user" ? (isDarkMode ? "#334155" : "#f1f5f9") : C.card, color: C.text, padding: "12px 16px", borderRadius: 16, borderTopRightRadius: msg.role === "user" ? 4 : 16, borderTopLeftRadius: msg.role === "assistant" ? 4 : 16, maxWidth: "80%", fontSize: 14, lineHeight: 1.6, border: msg.role === "assistant" ? `1px solid ${C.border}` : "none", boxShadow: msg.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.05)" : "none" }}>
                      {msg.role === "user" ? (
                        msg.content
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                          {chatLoading && i === chatHistory.length - 1 && (
                            <span style={{ display: "inline-block", width: 6, height: 14, background: C.accent, marginLeft: 4, animation: "blink 1s step-end infinite" }} />
                          )}
                          {!chatLoading && i !== 0 && (
                            <button onClick={() => speakText(msg.content)} style={{ background: "none", border: "none", cursor: "pointer", marginTop: 8, padding: 0, color: C.sub, display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                              🔊 Play
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} style={{ paddingBottom: 10 }} />
              </div>

              {/* Attachment Preview */}
              {attachment && (
                <div style={{ padding: "10px 20px", background: isDarkMode ? "#1e293b" : "#f8fafc", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ fontSize: 20 }}>📎</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 12, width: 24, height: 24, cursor: "pointer", display: "grid", placeItems: "center", fontSize: 12 }}>✕</button>
                </div>
              )}

              {/* Input Area (Fixed at bottom) */}
              <div style={{ padding: "12px 16px", background: C.card, borderTop: `1px solid ${C.border}`, flexShrink: 0, position: "relative" }}>
                
                {/* Attach Menu */}
                {showAttachMenu && (
                  <div style={{ position: "absolute", bottom: 70, left: 16, right: 16, background: isDarkMode ? "#1e293b" : "#fff", borderRadius: 16, padding: 16, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", border: `1px solid ${C.border}`, zIndex: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                      <button onClick={() => cameraInputRef.current?.click()} style={{ background: isDarkMode ? "#0f172a" : "#f8fafc", border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", color: C.text }}>
                        <span style={{ fontSize: 24 }}>📸</span> <span style={{ fontSize: 11, fontWeight: 700 }}>Camera</span>
                      </button>
                      <button onClick={() => photoInputRef.current?.click()} style={{ background: isDarkMode ? "#0f172a" : "#f8fafc", border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", color: C.text }}>
                        <span style={{ fontSize: 24 }}>🖼️</span> <span style={{ fontSize: 11, fontWeight: 700 }}>Photo</span>
                      </button>
                      <button onClick={() => docInputRef.current?.click()} style={{ background: isDarkMode ? "#0f172a" : "#f8fafc", border: `1px solid ${C.border}`, padding: 16, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", color: C.text }}>
                        <span style={{ fontSize: 24 }}>📄</span> <span style={{ fontSize: 11, fontWeight: 700 }}>Document</span>
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", background: isDarkMode ? "#0f172a" : "#f4f4f5", borderRadius: 24, padding: "6px 8px 6px 12px", border: `1px solid ${C.border}`, position: "relative" }}>
                  
                  <button onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ background: "none", border: "none", fontSize: 24, color: C.sub, cursor: "pointer", padding: "0 8px" }}>
                    +
                  </button>
                  
                  <input 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    onKeyDown={e => e.key === "Enter" && handleSendMessage()} 
                    placeholder={language === "hi" ? "Kuch bhi puchein..." : "Type a message..."} 
                    style={{ flex: 1, border: "none", background: "transparent", outline: "none", color: C.text, fontSize: 14, padding: "8px 0" }} 
                  />
                  
                  {chatInput.trim() || attachment ? (
                    <button onClick={() => handleSendMessage()} style={{ background: C.accent, color: "#fff", border: "none", width: 36, height: 36, borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
                    </button>
                  ) : (
                    <button onClick={startListening} style={{ background: isListening ? "#fef2f2" : "none", border: "none", fontSize: 20, color: isListening ? "#ef4444" : C.sub, cursor: "pointer", padding: "8px" }}>
                      🎤
                    </button>
                  )}
                </div>
                
                <div style={{ textAlign: "center", fontSize: 9, color: C.sub, marginTop: 8 }}>
                  BidWell AI can make mistakes.
                </div>
              </div>

              <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: "none" }} />
              <input type="file" ref={photoInputRef} accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              <input type="file" ref={docInputRef} accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} />
            </div>
          )}

'''
        content = before + new_ui + after

with open(file_path, 'w') as f:
    f.write(content)
print("✅ Chat layout locked and fixed successfully!")
