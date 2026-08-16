export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white p-6">
          <h1 className="text-2xl font-bold mb-1">EduPlus AI</h1>
          <p className="text-sm text-slate-400 mb-8">
            Smart College Portal
          </p>

          <nav className="space-y-2">
            <div className="bg-blue-600 rounded-lg px-4 py-3">
              Dashboard
            </div>
            <div className="px-4 py-3 text-slate-300">Attendance</div>
            <div className="px-4 py-3 text-slate-300">Academics</div>
            <div className="px-4 py-3 text-slate-300">Assignments</div>
            <div className="px-4 py-3 text-slate-300">Timetable</div>
            <div className="px-4 py-3 text-slate-300">Calendar</div>
            <div className="px-4 py-3 text-slate-300">Coding</div>
            <div className="px-4 py-3 text-slate-300">AI Assistant</div>
            <div className="px-4 py-3 text-slate-300">Fees</div>
          </nav>
        </aside>

        {/* Main Content */}
        <section className="flex-1 p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Good Morning, Alshifha</h2>
              <p className="text-slate-500 mt-1">
                Here's your academic overview.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">Alshifha</p>
                <p className="text-sm text-slate-500">Student</p>
              </div>

              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <p className="text-sm text-slate-500">Attendance</p>
              <h3 className="text-3xl font-bold mt-2">87%</h3>
              <p className="text-sm text-green-600 mt-2">
                Good attendance
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <p className="text-sm text-slate-500">Academic Score</p>
              <h3 className="text-3xl font-bold mt-2">82%</h3>
              <p className="text-sm text-blue-600 mt-2">
                Above average
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <p className="text-sm text-slate-500">Coding Problems</p>
              <h3 className="text-3xl font-bold mt-2">146</h3>
              <p className="text-sm text-purple-600 mt-2">
                This semester
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border">
              <p className="text-sm text-slate-500">AI Risk Score</p>
              <h3 className="text-3xl font-bold mt-2 text-green-600">
                Low
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Performance is stable
              </p>
            </div>

          </div>

          {/* Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold mb-4">
                Upcoming Activities
              </h3>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="font-semibold">AI Assignment</p>
                  <p className="text-sm text-slate-500">
                    Submission deadline: Tomorrow
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-semibold">CodeChef Contest</p>
                  <p className="text-sm text-slate-500">
                    Wednesday · 8:00 PM
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="font-semibold">Internal Assessment</p>
                  <p className="text-sm text-slate-500">
                    Coming next week
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold mb-4">
                AI Insight
              </h3>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-semibold text-blue-700">
                  You're doing well!
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Your attendance and academic performance are stable.
                  Try solving more coding problems this week to improve
                  your overall skill score.
                </p>
              </div>
            </div>

          </div>

        </section>
      </div>
    </main>
  );
}