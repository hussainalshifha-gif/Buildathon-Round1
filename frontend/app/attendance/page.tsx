export default function AttendancePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900">
        Attendance
      </h1>

      <p className="mt-2 text-slate-500">
        View your subject-wise attendance.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-slate-500">Overall Attendance</p>
          <h2 className="mt-2 text-3xl font-bold">87%</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-slate-500">Classes Attended</p>
          <h2 className="mt-2 text-3xl font-bold">42</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-slate-500">Classes Missed</p>
          <h2 className="mt-2 text-3xl font-bold">6</h2>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-xl font-bold mb-4">Subject-wise Attendance</h2>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span>Artificial Intelligence</span>
            <span className="font-semibold">91%</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Data Structures</span>
            <span className="font-semibold">86%</span>
          </div>

          <div className="flex justify-between border-b pb-3">
            <span>Database Management</span>
            <span className="font-semibold">84%</span>
          </div>

          <div className="flex justify-between">
            <span>Computer Networks</span>
            <span className="font-semibold">88%</span>
          </div>
        </div>
      </div>
    </main>
  );
}