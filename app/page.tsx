"use client";

import { useState } from "react";
import StudyDashboard from "./components/StudyDashboard";
import QuickQuiz from "./components/QuickQuiz";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quickActions = [
    {
      icon: "🤖",
      title: "AI Study Assistant",
      description: "Ask questions and get instant explanations",
    },
    {
      icon: "📚",
      title: "Smart Learning",
      description: "Learn difficult concepts in simple words",
    },
    {
      icon: "📝",
      title: "Exam Preparation",
      description: "Prepare better with AI-powered guidance",
    },
  ];

  const askAI = async () => {
    if (!message.trim()) {
      setError("Please enter a question first.");
      return;
    }

    setLoading(true);
    setReply("");
    setError("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      setReply(data.reply);
    } catch (err) {
      console.error("Frontend AI Error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Sorry, something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const useSuggestion = (text: string) => {
    setMessage(text);
    setReply("");
    setError("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0f2fe 100%)",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "24px 8%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              color: "#4f46e5",
            }}
          >
            EduPlus
          </h1>

          <p
            style={{
              margin: "4px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Learn smarter with AI
          </p>
        </div>

        <div
          style={{
            padding: "8px 14px",
            borderRadius: "20px",
            background: "#eef2ff",
            color: "#4f46e5",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          🤖 AI Powered
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "70px 20px 40px",
        }}
      >
        <div style={{ fontSize: "60px", marginBottom: "15px" }}>🎓</div>

        <h2
          style={{
            fontSize: "48px",
            margin: "0 0 16px",
            fontWeight: 800,
          }}
        >
          Welcome to <span style={{ color: "#4f46e5" }}>EduPlus AI</span>
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "18px",
            lineHeight: 1.7,
            color: "#6b7280",
          }}
        >
          Your personal AI learning assistant. Ask questions, understand
          difficult concepts, and learn at your own pace.
        </p>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {quickActions.map((action) => (
            <div
              key={action.title}
              style={{
                background: "white",
                padding: "28px",
                borderRadius: "18px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>
                {action.icon}
              </div>

              <h3 style={{ margin: "0 0 8px", fontSize: "20px" }}>
                {action.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  lineHeight: 1.6,
                }}
              >
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Assistant */}
      <section
        style={{
          maxWidth: "900px",
          margin: "60px auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "35px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <div style={{ fontSize: "45px" }}>🤖</div>

            <h2
              style={{
                fontSize: "32px",
                margin: "10px 0",
              }}
            >
              Ask EduPlus AI
            </h2>

            <p style={{ color: "#6b7280" }}>
              Ask anything about your studies and get a simple explanation.
            </p>
          </div>

          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askAI();
              }
            }}
            placeholder="Example: Explain machine learning in simple words..."
            rows={5}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "18px",
              borderRadius: "14px",
              border: "2px solid #e5e7eb",
              outline: "none",
              resize: "vertical",
              fontSize: "16px",
              fontFamily: "inherit",
            }}
          />

          <button
            onClick={askAI}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "15px",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background: loading ? "#9ca3af" : "#4f46e5",
              color: "white",
              fontSize: "17px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "🤔 EduPlus AI is thinking..." : "Ask AI ✨"}
          </button>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "18px",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() =>
                useSuggestion("Explain Artificial Intelligence in simple words")
              }
              style={suggestionStyle}
            >
              Explain AI
            </button>

            <button
              onClick={() => useSuggestion("What is machine learning?")}
              style={suggestionStyle}
            >
              What is Machine Learning?
            </button>

            <button
              onClick={() =>
                useSuggestion("Explain neural networks with an example")
              }
              style={suggestionStyle}
            >
              Explain Neural Networks
            </button>
          </div>

          {error && (
            <div
              style={{
                marginTop: "25px",
                padding: "16px",
                borderRadius: "12px",
                background: "#fef2f2",
                color: "#dc2626",
                border: "1px solid #fecaca",
              }}
            >
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {reply && (
            <div
              style={{
                marginTop: "25px",
                padding: "24px",
                borderRadius: "16px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  color: "#4f46e5",
                }}
              >
                🤖 EduPlus AI
              </h3>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.8,
                  color: "#374151",
                }}
              >
                {reply}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Study Dashboard */}
      <StudyDashboard />

      {/* Quick Quiz */}
      <QuickQuiz />

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "30px",
          color: "#6b7280",
          borderTop: "1px solid #e5e7eb",
          background: "white",
        }}
      >
        © 2026 EduPlus AI · Learn Smarter 🚀
      </footer>
    </main>
  );
}

const suggestionStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "20px",
  border: "1px solid #c7d2fe",
  background: "#eef2ff",
  color: "#4338ca",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
};