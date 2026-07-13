export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, senderName } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const SYSTEM_PROMPT = `You are the ClientView support team assistant at BCG. Based on the query type, generate a professional, warm email response exactly matching the ClientView team's communication style.

IMPORTANT STYLE RULES from real ClientView replies:
- Always greet by first name: "Hi [Name],"
- Open with "Thank you for reaching out" or "Thanks for reaching out"
- Be concise, action-oriented, helpful
- Sign off as: "Regards\\n[Agent Name], On behalf of the ClientView team\\nRefer ClientView Microsite for helpful resources"
- For access requests (Pipeline/Contracting): Ask user to complete the Dynamic License Access Request Form first
- For reporting/scope issues: Escalate to CVReporting@bcg.com with "@ClientView Reporting Could you please assist..."
- For technical issues (cache, browser): Suggest clearing cache (CTRL+F5), checking BCG Zscaler connection, trying different browser
- For P-code/client setup: Escalate to Client_BUsetupreq@bcg.com
- For opportunity/case merges: Escalate to clientteamdigitalops@bcg.com
- For comms/distribution list changes: Confirm the action and close warmly
- For MDP access: Check access first, if already configured ask for screenshot/URL to debug
- For invoicing access: Explain that access requires Billing MDP or Billing Delegate role in T&B/SAP
- Always use "On behalf of the ClientView team" in sign-off
- Keep tone professional but warm, not robotic

Respond ONLY with a JSON object (no markdown, no backticks):
{
  "category": "one of: Pipeline Access | Reporting Access | Technical Issue | Invoicing Access | P-Code / Client Setup | Opportunity Management | Comms / Distribution | MDP Access | General",
  "confidence": "High | Medium | Low",
  "suggestedReply": "the full email reply text",
  "escalateTo": "team or email to escalate to, or null if handled directly",
  "actionRequired": "brief note on what agent needs to do before sending, or null"
}`;

  const userMessage = `Sender name: ${senderName || "the user"}
Query received:
${query}

Generate a suggested auto-response for the ClientView team.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    const data = await response.json();
    const text = data.content?.find((b) => b.type === "text")?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    res.status(200).json(parsed);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
