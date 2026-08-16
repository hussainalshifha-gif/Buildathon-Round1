"use client";

import { useState } from "react";

export default function StudyDashboard() {
  const [completed, setCompleted] = useState(3);

  const subjects = [
    { name: "Artificial Intelligence", progress: 75, icon: "🤖" },
    { name: "Machine Learning", progress: 60, icon: "🧠" },
    { name: "Deep Learning", progress: 45, icon: "🔬" },
    { name: "Java Programming", progress: 80, icon: "☕" },
  ];

  const totalTasks = 5;

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600">
            EDUPLUS STUDENT HUB
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Study Dashboard 📚
          </h1>

          <p className="mt-2 text-slate-600">
            Track your learning, complete your goals and stay consistent.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Today's Progress</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {completed}/{totalTasks}
            </h2>
            <p className="mt-2 text-sm text-green-600">
              Keep going! 🔥
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Study Time</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              2h 35m
            </h2>
            <p className="mt-2 text-sm text-blue-600">
              +35 min today
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Current Streak</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              7 🔥
            </h2>
            <p className="mt-2 text-sm text-orange-600">
              Don't break the streak!
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Subject Progress
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{subject.icon}</span>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {subject.name}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {subject.progress}% completed
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-blue-600">
                    {subject.progress}%
                  </span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Today's Goals 🎯
          </h2>

          <div className="mt-5 space-y-3">
            {[
              "Complete Machine Learning notes",
              "Solve 5 Java problems",
              "Revise Artificial Intelligence",
              "Take a quick quiz",
              "Review today's concepts",
            ].map((goal, index) => (
              <label
                key={goal}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-4"
              >
                <input
                  type="checkbox"
                  checked={index < completed}
                  onChange={() => {
                    if (index < completed) {
                      setCompleted(completed - 1);
                    } else {
                      setCompleted(Math.min(completed + 1, totalTasks));
                    }
                  }}
                  className="h-5 w-5"
                />

                <span className="text-slate-700">{goal}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}