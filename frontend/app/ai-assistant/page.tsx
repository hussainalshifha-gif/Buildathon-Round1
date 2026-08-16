"use client";

import { useState } from "react";

export default function AIAssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askAI = async () => {
    if (!question.trim()) return;

    setAnswer("Thinking...");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: question,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.answer || data.message || "No response received.");
      } else {
        setAnswer(
          "AI service is currently unavailable. Please try again later."
        );
      }
    } catch {
      setAnswer(
        "AI service is currently unavailable. Please try again later."
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </a>

        <div className="bg-white border rounded-2xl p-8 mt-6">
          <div className="mb-8">
            <p className="text-purple-600 font-semibold">
              EduPlus AI
            </p>

            <h1 className="text-4xl font-bold text-slate-900 mt-2">
              AI Assistant
            </h1>

            <p className="text-slate-500 mt-2">
              Ask questions about your academics, attendance,
              assignments and learning.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask EduPlus AI something..."
              rows={5}
              className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={askAI}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-lg"
            >
              Ask AI
            </button>
          </div>

          {answer && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="font-bold text-blue-700">
                EduPlus AI Response
              </h2>

              <p className="text-slate-700 mt-3 whitespace-pre-wrap">
                {answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}