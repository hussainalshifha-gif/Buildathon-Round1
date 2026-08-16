export default function AssignmentsPage() {
  const assignments = [
    {
      title: "AI & Machine Learning",
      subject: "Artificial Intelligence",
      due: "Tomorrow",
      status: "Pending",
    },
    {
      title: "Data Structures Implementation",
      subject: "Data Structures",
      due: "Aug 20",
      status: "Pending",
    },
    {
      title: "Python Programming Task",
      subject: "Python",
      due: "Aug 23",
      status: "Submitted",
    },
    {
      title: "Mathematics Problem Set",
      subject: "Mathematics",
      due: "Aug 25",
      status: "Pending",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-6xl mx-auto">
        <a
          href="/"
          className="text-blue-600 hover:underline"
        >
          ← Back to Dashboard
        </a>

        <h1 className="text-4xl font-bold text-slate-900 mt-6">
          Assignments
        </h1>

        <p className="text-slate-500 mt-2">
          Track assignments, deadlines and submission status.
        </p>

        <div className="grid gap-5 mt-8">
          {assignments.map((assignment) => (
            <div
              key={assignment.title}
              className="bg-white border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {assignment.title}
                </h2>

                <p className="text-slate-500 mt-1">
                  {assignment.subject}
                </p>

                <p className="text-sm text-slate-500 mt-3">
                  Due: {assignment.due}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  assignment.status === "Submitted"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {assignment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}