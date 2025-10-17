import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const input_as_text = body?.input_as_text;
  if (!input_as_text) {
    return NextResponse.json({ error: "Missing input_as_text" }, { status: 400 });
  }

  const workflowId = process.env.WORKFLOW_ID;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!workflowId || !apiKey) {
    return NextResponse.json({ error: "Server missing env vars" }, { status: 500 });
  }

  const r = await fetch(`https://api.openai.com/v1/workflows/${workflowId}/run`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: { input_as_text }
    })
  });

  const json = await r.json();
  if (!r.ok) return NextResponse.json(json, { status: r.status });

  const fileUrl =
    json?.output?.file?.url ||
    json?.output?.files?.[0]?.url ||
    json?.file?.url ||
    null;

  return NextResponse.json({ success: true, fileUrl, raw: json });
}
