export default function CalendarPage() {
  const events = [
    {
      date: "Aug 18",
      title: "AI Assignment",
      type: "Assignment",
    },
    {
      date: "Aug 20",
      title: "CodeChef Contest",
      type: "Coding",
    },
    {
      date: "Aug 22",
      title: "Internal Assessment",
      type: "Exam",
    },
    {
      date: "Aug 25",
      title: "Project Review",
      type: "Academic",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-6xl mx-auto">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </a>

        <h1 className="text-4xl font-bold text-slate-900 mt-6">
          Calendar
        </h1>

        <p className="text-slate-500 mt-2">
          Upcoming academic events and activities
        </p>

        <div className="grid gap-5 mt-8">
          {events.map((event) => (
            <div
              key={event.title}
              className="bg-white border rounded-2xl p-6 flex items-center gap-6"
            >
              <div className="min-w-20 text-center bg-blue-50 rounded-xl p-4">
                <p className="text-blue-600 font-bold">
                  {event.date}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {event.title}
                </h2>

                <p className="text-slate-500 mt-1">
                  {event.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}