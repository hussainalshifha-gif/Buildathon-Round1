export default function TimetablePage() {
  const timetable = [
    ["09:00", "Artificial Intelligence", "Room 301"],
    ["10:00", "Data Structures", "Room 204"],
    ["11:00", "Machine Learning", "Lab 2"],
    ["01:30", "Python Programming", "Lab 1"],
    ["02:30", "Mathematics", "Room 105"],
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-6xl mx-auto">
        <a href="/" className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </a>

        <h1 className="text-4xl font-bold text-slate-900 mt-6">
          Timetable
        </h1>

        <p className="text-slate-500 mt-2">
          Today's class schedule
        </p>

        <div className="bg-white border rounded-2xl overflow-hidden mt-8">
          {timetable.map(([time, subject, room]) => (
            <div
              key={time}
              className="grid grid-cols-3 gap-4 p-5 border-b last:border-b-0"
            >
              <span className="font-semibold text-blue-600">
                {time}
              </span>

              <span className="font-medium text-slate-900">
                {subject}
              </span>

              <span className="text-slate-500">
                {room}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}