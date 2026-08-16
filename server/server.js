import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

if (!API_KEY) {
  console.warn("WARNING: ANTHROPIC_API_KEY is not set. Create server/.env with your key.");
}

// POST /api/chat  { system: string, prompt: string, json?: boolean }
app.post("/api/chat", async (req, res) => {
  const { system, prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1000,
        system: system || "",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(response.status).json({ error: "Anthropic API error", detail: errText });
    }

    const data = await response.json();
    const text = (data.content || []).map((b) => b.text || "").join("\n");
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error contacting Anthropic API" });
  }
});

app.get("/api/health", (req, res) => res.json({ ok: true, model: MODEL }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
