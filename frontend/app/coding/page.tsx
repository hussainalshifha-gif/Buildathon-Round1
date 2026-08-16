"use client";

import { useState } from "react";

export default function CodingPage() {
  const [solved, setSolved] = useState(146);

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-6xl mx-auto">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </a>

        <h1 className="text-4xl font-bold text-slate-900 mt-6">
          Coding Progress
        </h1>

        <p className="text-slate-500 mt-2">
          Track your programming practice and problem-solving progress.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border rounded-2xl p-6">
            <p className="text-slate-500">Problems Solved</p>
            <p className="text-4xl font-bold text-purple-600 mt-3">
              {solved}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-slate-500">Current Streak</p>
            <p className="text-4xl font-bold text-orange-500 mt-3">
              12 days
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <p className="text-slate-500">Skill Level</p>
            <p className="text-4xl font-bold text-green-600 mt-3">
              Intermediate
            </p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-7 mt-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Recommended Practice
          </h2>

          <div className="space-y-4 mt-6">
            <Challenge
              title="Arrays & Strings"
              difficulty="Easy"
            />

            <Challenge
              title="Binary Search"
              difficulty="Medium"
            />

            <Challenge
              title="Dynamic Programming"
              difficulty="Hard"
            />
          </div>

          <button
            onClick={() => setSolved(solved + 1)}
            className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Mark Practice Completed
          </button>
        </div>
      </div>
    </main>
  );
}

function Challenge({
  title,
  difficulty,
}: {
  title: string;
  difficulty: string;
}) {
  return (
    <div className="flex justify-between items-center border rounded-xl p-5">
      <div>
        <h3 className="font-bold text-slate-900">
          {title}
        </h3>

        <p className="text-slate-500 mt-1">
          Coding practice challenge
        </p>
      </div>

      <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
        {difficulty}
      </span>
    </div>
  );
}