"use client";

import { useState } from "react";

export default function QuickQuiz() {
  const questions = [
    {
      question: "What is Machine Learning?",
      options: [
        "A type of database",
        "A method where computers learn from data",
        "A programming language",
        "A hardware device",
      ],
      answer: 1,
    },
    {
      question: "Which language is commonly used in AI?",
      options: ["HTML", "CSS", "Python", "SQL"],
      answer: 2,
    },
    {
      question: "What does AI stand for?",
      options: [
        "Automated Internet",
        "Artificial Intelligence",
        "Advanced Input",
        "Applied Information",
      ],
      answer: 1,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[current];

  const chooseAnswer = (index: number) => {
    if (selected !== null) return;

    setSelected(index);

    if (index === question.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (current === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrent((prev) => prev + 1);
    setSelected(null);
  };

  const restartQuiz = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
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
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "45px" }}>📝</div>

          <h2
            style={{
              fontSize: "32px",
              margin: "10px 0",
              color: "#111827",
            }}
          >
            Quick Quiz
          </h2>

          <p style={{ color: "#6b7280" }}>
            Test your knowledge in a few seconds.
          </p>
        </div>

        {finished ? (
          <div
            style={{
              marginTop: "30px",
              textAlign: "center",
              padding: "30px",
              background: "#eef2ff",
              borderRadius: "18px",
            }}
          >
            <div style={{ fontSize: "50px" }}>🏆</div>

            <h3
              style={{
                fontSize: "26px",
                margin: "12px 0",
                color: "#4338ca",
              }}
            >
              Quiz Completed!
            </h3>

            <p
              style={{
                fontSize: "20px",
                color: "#374151",
              }}
            >
              Your score: <strong>{score}/3</strong>
            </p>

            <button
              onClick={restartQuiz}
              style={{
                marginTop: "15px",
                padding: "13px 25px",
                border: "none",
                borderRadius: "12px",
                background: "#4f46e5",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Try Again 🔄
            </button>
          </div>
        ) : (
          <div style={{ marginTop: "30px" }}>
            <p
              style={{
                color: "#4f46e5",
                fontWeight: 700,
              }}
            >
              Question {current + 1} of {questions.length}
            </p>

            <h3
              style={{
                fontSize: "23px",
                color: "#111827",
                marginBottom: "20px",
              }}
            >
              {question.question}
            </h3>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {question.options.map((option, index) => {
                const isCorrect = selected !== null && index === question.answer;
                const isWrong =
                  selected === index && index !== question.answer;

                return (
                  <button
                    key={option}
                    onClick={() => chooseAnswer(index)}
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      borderRadius: "14px",
                      border: isCorrect
                        ? "2px solid #16a34a"
                        : isWrong
                        ? "2px solid #dc2626"
                        : "1px solid #d1d5db",
                      background: isCorrect
                        ? "#f0fdf4"
                        : isWrong
                        ? "#fef2f2"
                        : "white",
                      color: "#374151",
                      cursor:
                        selected !== null ? "default" : "pointer",
                      fontSize: "16px",
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <button
                onClick={nextQuestion}
                style={{
                  width: "100%",
                  marginTop: "20px",
                  padding: "15px",
                  border: "none",
                  borderRadius: "14px",
                  background: "#4f46e5",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {current === questions.length - 1
                  ? "Finish Quiz 🏆"
                  : "Next Question →"}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}