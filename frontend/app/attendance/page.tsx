"use client";

import { useState } from "react";

const students = [
  { name: "Vinitha", registerNo: "23AIML001", attendance: 92 },
  { name: "Ramya", registerNo: "23AIML002", attendance: 88 },
  { name: "Jeyashree", registerNo: "23AIML003", attendance: 84 },
  { name: "Student 4", registerNo: "23AIML004", attendance: 79 },
  { name: "Student 5", registerNo: "23AIML005", attendance: 91 },
];

export default function AttendancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Overall");

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-10">
      <div className="max-w-6xl mx-auto">

        <a
          href="/"
          className="inline-flex items-center text-blue-600 font-medium hover:underline"
        >
          ← Back to Dashboard
        </a>

        {/* Header */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Attendance
            </h1>

            <p className="text-slate-500 mt-2">
              Monitor student attendance and attendance trends.
            </p>
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-slate-300 bg-white rounded-lg px-4 py-3"
          >
            <option>Overall</option>
            <option>Current Semester</option>
            <option>Current Month</option>
          </select>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <SummaryCard
            title="Overall Attendance"
            value="87%"
            description="Good attendance"
            color="text-green-600"
          />

          <SummaryCard
            title="Present Days"
            value="104"
            description="This semester"
            color="text-blue-600"
          />

          <SummaryCard
            title="Absent Days"
            value="16"
            description="This semester"
            color="text-red-600"
          />

        </div>

        {/* Attendance Table */}
        <div className="bg-white border border-slate-200 rounded-2xl mt-8 overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-slate-900">
              Student Attendance
            </h2>

            <p className="text-slate-500 mt-1">
              Attendance records for {selectedPeriod.toLowerCase()}.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-5 font-semibold">
                    Student
                  </th>

                  <th className="text-left p-5 font-semibold">
                    Register No.
                  </th>

                  <th className="text-left p-5 font-semibold">
                    Attendance
                  </th>

                  <th className="text-left p-5 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.registerNo}
                    className="border-t border-slate-100"
                  >
                    <td className="p-5 font-medium text-slate-900">
                      {student.name}
                    </td>

                    <td className="p-5 text-slate-500">
                      {student.registerNo}
                    </td>

                    <td className="p-5 font-bold">
                      {student.attendance}%
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          student.attendance >= 85
                            ? "bg-green-100 text-green-700"
                            : student.attendance >= 75
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {student.attendance >= 85
                          ? "Good"
                          : student.attendance >= 75
                          ? "Warning"
                          : "Low"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

        {/* Attendance Insight */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">

          <h2 className="text-xl font-bold text-blue-700">
            Attendance Insight
          </h2>

          <p className="text-slate-700 mt-2 leading-relaxed">
            Students maintaining attendance above 85% are in a
            healthy range. Students between 75% and 85% should
            monitor their attendance regularly to avoid falling
            below the required minimum.
          </p>

        </div>

      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">

      <p className="text-slate-500">
        {title}
      </p>

      <p className={`text-4xl font-bold mt-3 ${color}`}>
        {value}
      </p>

      <p className="text-sm text-slate-500 mt-2">
        {description}
      </p>

    </div>
  );
}