import re

file_path = 'app/dashboard/page.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Add Workspace State
state_code = '''
  const [workspace, setWorkspace] = useState<any[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
'''
content = content.replace(
    'const [showJVModal, setShowJVModal] = useState(false);',
    'const [showJVModal, setShowJVModal] = useState(false);\n' + state_code
)

# 2. Fetch Workspace Data
fetch_code = '''
  // Fetch Workspace
  useEffect(() => {
    if (active === "Bid workspace") {
      setWorkspaceLoading(true);
      fetch('/api/workspace').then(r => r.json()).then(d => {
        if (d.success) setWorkspace(d.workspace);
        setWorkspaceLoading(false);
      });
    }
  }, [active]);

  const updateWorkspaceStatus = async (id: string, newStatus: string) => {
    const updated = workspace.map(w => w.id === id ? { ...w, status: newStatus } : w);
    setWorkspace(updated);
    await fetch('/api/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    });
  };

  const toggleChecklist = async (id: string, key: string) => {
    const item = workspace.find(w => w.id === id);
    const newChecklist = { ...item.checklist, [key]: !item.checklist[key] };
    const updated = workspace.map(w => w.id === id ? { ...w, checklist: newChecklist } : w);
    setWorkspace(updated);
    await fetch('/api/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, checklist: newChecklist })
    });
  };
'''
content = content.replace(
    'const handleLogout = async () => {',
    fetch_code + '\n  const handleLogout = async () => {'
)

# 3. Replace Bid workspace UI
old_workspace_ui = '''{active === "Bid workspace" && (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)", padding: 20, borderRadius: 16, color: "#fff" }}>
                <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>✳ AI Rate Suggestion</div>
                <div style={{ fontSize: 13, color: "#c7d2fe" }}>Bid Workspace is ready.</div>
              </div>
            </div>
          )}'''

new_workspace_ui = '''{active === "Bid workspace" && (
            <div style={{ display: "grid", gap: 16 }}>
              {workspaceLoading ? (
                <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>Loading your bids...</div>
              ) : workspace.length === 0 ? (
                <div style={{ background: "#fff", padding: 40, borderRadius: 14, textAlign: "center", border: "1px solid #e8edf5" }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>📁</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#17233b" }}>No active bids</div>
                  <p style={{ fontSize: 12, color: "#64748b", marginTop: 8 }}>Go to Live Tenders and click "Add to Bid Workspace" to start tracking.</p>
                </div>
              ) : (
                workspace.map((w) => (
                  <div key={w.id} style={{ background: "#fff", padding: 20, borderRadius: 14, border: "1px solid #e8edf5" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#17233b" }}>{w.title}</div>
                        <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{w.org_name}</div>
                      </div>
                      <select value={w.status} onChange={(e) => updateWorkspaceStatus(w.id, e.target.value)} style={{ padding: "6px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 11, fontWeight: 700, background: w.status === 'Submitted' ? '#dcfce7' : w.status === 'Won' ? '#d1fae5' : '#f8fafc' }}>
                        <option value="Review">Review</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>
                    
                    <div style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", marginBottom: 8 }}>Checklist:</div>
                      <div style={{ display: "flex", gap: 16 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={w.checklist?.emd || false} onChange={() => toggleChecklist(w.id, 'emd')} /> EMD Paid
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={w.checklist?.docs || false} onChange={() => toggleChecklist(w.id, 'docs')} /> Docs Ready
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={w.checklist?.jv || false} onChange={() => toggleChecklist(w.id, 'jv')} /> JV Done
                        </label>
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#64748b" }}>
                      <span>Deadline: <b style={{ color: "#ef4444" }}>{w.closing_date}</b></span>
                      <span>Value: <b style={{ color: "#17233b" }}>{w.value ? `₹${w.value}` : "N/A"}</b></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}'''
content = content.replace(old_workspace_ui, new_workspace_ui)

with open(file_path, 'w') as f:
    f.write(content)
print("✅ Bid Workspace UI updated!")
