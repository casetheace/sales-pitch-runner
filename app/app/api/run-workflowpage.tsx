"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState(
`prospect_name: EA Sween
industry_segment: processed_foods
salesforce_focus: ["TPM","Sales Cloud"]
meeting_context: executive_briefing
timeline_hint: 2025 planning cycle
known_challenges: fragmented trade data; manual claims; low promo ROI`
  );
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [raw, setRaw] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true); setFileUrl(null); setError(null); setRaw(null);
    try {
      const r = await fetch("/api/run-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_as_text: input })
      });
      const json = await r.json();
      if (!r.ok) { setError(json?.error || "Request failed"); setRaw(json); }
      else { setFileUrl(json?.fileUrl || null); setRaw(json); }
    } catch (e:any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 880, margin: "40px auto", padding: 16, fontFamily: "Inter, system-ui, Arial" }}>
      <h1>Salesforce Pitch Deck Runner</h1>
      <p>Runs your published workflow and returns a downloadable PPTX when available.</p>

      <label style={{ display: "block", marginTop: 16 }}>Input (input_as_text)</label>
      <textarea
        rows={10}
        style={{ width: "100%", fontFamily: "Menlo, monospace" }}
        value={input}
        onChange={e => setInput(e.target.value)}
      />

      <button onClick={run} disabled={loading} style={{ marginTop: 12, padding: "10px 16px" }}>
        {loading ? "Running…" : "Run Workflow"}
      </button>

      {fileUrl && (
        <div style={{ marginTop: 16 }}>
          <a href={fileUrl} target="_blank" rel="noreferrer">Download deck (.pptx)</a>
        </div>
      )}

      {error && <div style={{ color: "crimson", marginTop: 12 }}>{error}</div>}

      <details style={{ marginTop: 16 }}>
        <summary>Show raw response</summary>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(raw, null, 2)}</pre>
      </details>
    </main>
  );
}

