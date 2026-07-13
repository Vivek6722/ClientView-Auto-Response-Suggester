import { useState } from "react";

const QUERY_EXAMPLES = [
  "Hi, I need access to ClientView pipeline reporting for my team.",
  "I'm unable to access the Invoicing portal. Getting an error.",
  "Can you add my colleague to the ClientView release update comms?",
  "My global scope is restricted to NAMR only, I need worldwide access.",
  "I need to re-open a ClientView opportunity for case code 10038921.",
  "There's an error during P-code creation for my client.",
  "Please reinstate my broader access to CV reports.",
  "I need MDP permanent access to ClientView.",
];

const categoryColors = {
  "Pipeline Access": "#3B82F6",
  "Reporting Access": "#8B5CF6",
  "Technical Issue": "#EF4444",
  "Invoicing Access": "#F59E0B",
  "P-Code / Client Setup": "#10B981",
  "Opportunity Management": "#06B6D4",
  "Comms / Distribution": "#EC4899",
  "MDP Access": "#6366F1",
  "General": "#6B7280",
};

const confidenceBg = { High: "#D1FAE5", Medium: "#FEF3C7", Low: "#FEE2E2" };
const confidenceColor = { High: "#065F46", Medium: "#92400E", Low: "#991B1B" };

export default function App() {
  const [query, setQuery] = useState("");
  const [senderName, setSenderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setCopied(false);

    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, senderName }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError("Failed to generate response. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (result?.suggestedReply) {
      navigator.clipboard.writeText(result.suggestedReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1E3A5F 0%, #0F2340 100%)",
        padding: "24px 32px", display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>✉️</div>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>
            ClientView Auto-Response Suggester
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 }}>
            AI-powered replies trained on real ClientView team responses
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 24px" }}>

        {/* Input Card */}
        <div style={{
          background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0",
          padding: 24, marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Sender's First Name
            </label>
            <input
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Teresa"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: "1.5px solid #E2E8F0", fontSize: 14, color: "#111827",
                outline: "none", boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
              Incoming Query
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste the user's email query here..."
              rows={5}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 8,
                border: "1.5px solid #E2E8F0", fontSize: 14, color: "#111827",
                outline: "none", resize: "vertical", boxSizing: "border-box",
                fontFamily: "inherit", lineHeight: 1.6,
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
              onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !query.trim()}
            style={{
              background: loading || !query.trim()
                ? "#94A3B8"
                : "linear-gradient(135deg, #1E3A5F, #2563EB)",
              color: "#fff", border: "none", borderRadius: 8,
              padding: "11px 24px", fontSize: 14, fontWeight: 600,
              cursor: loading || !query.trim() ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            {loading ? "⟳ Generating..." : "✨ Generate Response"}
          </button>
        </div>

        {/* Quick Examples */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: "#6B7280",
            marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em",
          }}>
            Try an example query
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {QUERY_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setQuery(ex); setResult(null); setError(null); }}
                style={{
                  background: "#fff", border: "1.5px solid #E2E8F0",
                  borderRadius: 20, padding: "6px 14px", fontSize: 12,
                  color: "#374151", cursor: "pointer", fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { e.target.style.borderColor = "#3B82F6"; e.target.style.color = "#2563EB"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "#E2E8F0"; e.target.style.color = "#374151"; }}
              >
                {ex.length > 50 ? ex.slice(0, 50) + "…" : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA",
            borderRadius: 10, padding: "14px 18px", color: "#991B1B",
            fontSize: 14, marginBottom: 20,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            background: "#fff", borderRadius: 14,
            border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}>
            {/* Meta bar */}
            <div style={{
              background: "#F8FAFC", borderBottom: "1px solid #E2E8F0",
              padding: "14px 24px", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
            }}>
              <span style={{
                background: categoryColors[result.category] || "#6B7280",
                color: "#fff", borderRadius: 6, padding: "4px 12px",
                fontSize: 12, fontWeight: 600,
              }}>{result.category}</span>
              <span style={{
                background: confidenceBg[result.confidence],
                color: confidenceColor[result.confidence],
                borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600,
              }}>{result.confidence} Confidence</span>
              {result.escalateTo && (
                <span style={{
                  background: "#EFF6FF", color: "#1D4ED8",
                  borderRadius: 6, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                }}>Escalate → {result.escalateTo}</span>
              )}
            </div>

            {/* Agent action note */}
            {result.actionRequired && (
              <div style={{
                background: "#FFFBEB", borderBottom: "1px solid #FDE68A",
                padding: "12px 24px", display: "flex", gap: 10, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#92400E", marginBottom: 2 }}>
                    Action Required Before Sending
                  </div>
                  <div style={{ fontSize: 13, color: "#78350F" }}>{result.actionRequired}</div>
                </div>
              </div>
            )}

            {/* Reply */}
            <div style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Suggested Reply</div>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? "#D1FAE5" : "#F1F5F9",
                    color: copied ? "#065F46" : "#374151",
                    border: "none", borderRadius: 6,
                    padding: "6px 14px", fontSize: 12, fontWeight: 600,
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >{copied ? "✓ Copied!" : "Copy"}</button>
              </div>
              <div style={{
                background: "#F8FAFC", borderRadius: 10,
                border: "1px solid #E2E8F0", padding: "18px 20px",
                fontSize: 14, color: "#1F2937", lineHeight: 1.7,
                whiteSpace: "pre-wrap", fontFamily: "inherit",
              }}>
                {result.suggestedReply}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
