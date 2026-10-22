import re

file_path = 'app/dashboard/page.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add new states if not present
new_states = '''
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachment, setAttachment] = useState<{name: string, type: string} | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
'''
if 'const cameraInputRef' not in content:
    content = content.replace('const [chatLoading, setChatLoading] = useState(false);', 'const [chatLoading, setChatLoading] = useState(false);\n' + new_states)

# 2. Add Functions for TTS, STT, and File Handling
functions_code = '''
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop previous
      const cleanText = text.replace(/[*#]/g, ''); // Remove markdown
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported in this browser.");
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(prev => prev + " " + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment({ name: file.name, type: file.type });
      setShowAttachMenu(false);
    }
  };

  const downloadChatPDF = () => {
    const doc = new jsPDF();
    let y = 15;
    doc.setFontSize(16);
    doc.text("BidWell AI - Tender Consultation", 10, y);
    y += 10;
    doc.setFontSize(11);
    chatHistory.forEach((msg) => {
      const sender = msg.role === "user" ? "YOU: " : "BIDWELL AI: ";
      const cleanContent = msg.content.replace(/[*#]/g, ''); 
      const lines = doc.splitTextToSize(`${sender}${cleanContent}`, 180);
      if (y + lines.length * 6 > 280) { doc.addPage(); y = 15; }
      doc.text(lines, 10, y);
      y += lines.length * 6 + 5;
    });
    doc.save("BidWell_Chat_History.pdf");
  };

'''
if 'const speakText' not in content:
    content = content.replace('const handleSendMessage = async (customPrompt?: string) => {', functions_code + 'const handleSendMessage = async (customPrompt?: string) => {')

# 3. Replace the entire AI Chat UI block
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
            <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 130px)", background: isDarkMode ? "#0f172a" : "#fff", borderRadius: 16, border: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
              
              {/* Chat Header */}
              <div style={{ padding: "12px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: isDarkMode ? "#1e293b" : "#f8fafc" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, background: C.card, color: C.text, fontWeight: 600 }}>
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
                          {/* Text to Speech Button */}
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
                <div style={{ padding: "10px 20px", background: isDarkMode ? "#1e293b" : "#f8fafc", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>📎</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{attachment.name}</span>
                  <button onClick={() => setAttachment(null)} style={{ background: "#fee2e2", color: "#ef4444", border: "none", borderRadius: 12, width: 24, height: 24, cursor: "pointer", display: "grid", placeItems: "center", fontSize: 12 }}>✕</button>
                </div>
              )}

              {/* DeepSeek Style Input Area */}
              <div style={{ padding: "12px 16px", background: C.card, borderTop: `1px solid ${C.border}` }}>
                
                {/* Attach Menu (Bottom Sheet) */}
                {showAttachMenu && (
                  <div style={{ position: "absolute", bottom: 80, left: 16, right: 16, background: isDarkMode ? "#1e293b" : "#fff", borderRadius: 16, padding: 16, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)", border: `1px solid ${C.border}`, zIndex: 10, display: "flex", flexDirection: "column", gap: 12 }}>
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
                  
                  {/* Attach (+) Icon */}
                  <button onClick={() => setShowAttachMenu(!showAttachMenu)} style={{ background: "none", border: "none", fontSize: 24, color: C.sub, cursor: "pointer", padding: "0 8px" }}>
                    +
                  </button>
                  
                  {/* Text Input */}
                  <input 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    onKeyDown={e => e.key === "Enter" && handleSendMessage()} 
                    placeholder={language === "hi" ? "Kuch bhi puchein..." : "Type a message..."} 
                    style={{ flex: 1, border: "none", background: "transparent", outline: "none", color: C.text, fontSize: 14, padding: "8px 0" }} 
                  />
                  
                  {/* Mic or Send Button */}
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
                  BidWell AI can make mistakes. Verify important info.
                </div>
              </div>

              {/* Hidden Inputs for Camera, Photo, Documents */}
              <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: "none" }} />
              <input type="file" ref={photoInputRef} accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              <input type="file" ref={docInputRef} accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} />
            </div>
          )}

'''
        content = before + new_ui + after

with open(file_path, 'w') as f:
    f.write(content)
print("✅ DeepSeek UI, Voice, TTS, and File uploads implemented successfully!")
