"use client";

import { useState } from "react";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  const openAIPerformance = () => {
    window.open("http://localhost:5173", "_blank");
  };

  const handleFeature = (name: string) => {
    if (name === "AI Performance") {
      openAIPerformance();
      return;
    }

    setMessage(`${name} section is ready for integration.`);
  };

  const menuItems = [
    "Dashboard",
    "Attendance",
    "Academics",
    "Assignments",
    "Timetable",
    "Calendar",
    "Coding",
    "AI Assistant",
    "AI Performance",
    "Fees",
  ];

  return (
    <main className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 min-h-screen bg-slate-950 text-white p-7">
        <div className="mb-10">
          <h1 className="text-2xl font-bold">EduPlus AI</h1>
          <p className="text-slate-400 mt-2">Smart College Portal</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => handleFeature(item)}
              className={`w-full text-left px-5 py-3 rounded-lg transition ${
                item === "Dashboard"
                  ? "bg-blue-600 text-white"
                  : item === "AI Performance"
                  ? "bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white"
                  : "text-slate-200 hover:bg-slate-800"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-10 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-sm text-slate-400">AI Powered</p>
          <p className="text-sm text-white mt-1">
            Personalized student insights
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              Good Morning, Alshifha
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Here's your academic overview.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-slate-900">Alshifha</p>
              <p className="text-slate-500">Student</p>
            </div>

            <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              A
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Attendance"
            value="87%"
            subtitle="Good attendance"
            subtitleColor="text-green-600"
          />

          <StatCard
            title="Academic Score"
            value="82%"
            subtitle="Above average"
            subtitleColor="text-blue-600"
          />

          <StatCard
            title="Coding Problems"
            value="146"
            subtitle="This semester"
            subtitleColor="text-purple-600"
          />

          <StatCard
            title="AI Risk Score"
            value="Low"
            subtitle="Performance is stable"
            subtitleColor="text-green-600"
            valueColor="text-green-600"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">
          {/* Upcoming Activities */}
          <div className="xl:col-span-2 bg-white border border-slate-300 rounded-2xl p-7">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              Upcoming Activities
            </h3>

            <div className="space-y-4">
              <Activity
                title="AI Assignment"
                subtitle="Submission deadline: Tomorrow"
              />

              <Activity
                title="CodeChef Contest"
                subtitle="Wednesday · 8:00 PM"
              />

              <Activity
                title="Internal Assessment"
                subtitle="Coming next week"
              />
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-white border border-slate-300 rounded-2xl p-7">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">
              AI Insight
            </h3>

            <div className="bg-blue-50 rounded-xl p-5">
              <h4 className="font-bold text-blue-700 text-lg">
                You're doing well!
              </h4>

              <p className="text-slate-600 mt-3 leading-relaxed">
                Your attendance and academic performance are stable. Try
                solving more coding problems this week to improve your overall
                skill score.
              </p>
            </div>
          </div>
        </div>

        {/* AI Performance Highlight */}
        <div className="mt-7 bg-white border border-purple-200 rounded-2xl p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <p className="text-purple-600 font-semibold">
                AI-Powered Student Analysis
              </p>

              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                View your complete AI Performance Report
              </h3>

              <p className="text-slate-500 mt-2">
                Check risk score, weak subjects, coding activity,
                personalized recommendations and AI doubt support.
              </p>
            </div>

            <button
              onClick={openAIPerformance}
              className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-7 py-3 rounded-lg"
            >
              Open AI Performance
            </button>
          </div>
        </div>

        {message && (
          <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4">
            {message}
          </div>
        )}
      </section>
    </main>
  );
}

/* Statistics Card */

function StatCard({
  title,
  value,
  subtitle,
  subtitleColor,
  valueColor = "text-slate-900",
}: {
  title: string;
  value: string;
  subtitle: string;
  subtitleColor: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-white border border-slate-300 rounded-2xl p-6">
      <p className="text-slate-500 text-lg">{title}</p>

      <p className={`text-4xl font-bold mt-3 ${valueColor}`}>{value}</p>

      <p className={`mt-3 ${subtitleColor}`}>{subtitle}</p>
    </div>
  );
}

/* Activity Card */

function Activity({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="border border-slate-300 rounded-xl p-5">
      <h4 className="font-bold text-lg text-slate-900">{title}</h4>
      <p className="text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}