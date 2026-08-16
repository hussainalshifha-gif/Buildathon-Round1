export default function AcademicsPage() {
  const subjects = [
    {
      name: "Artificial Intelligence",
      score: "88%",
      level: "Excellent",
    },
    {
      name: "Machine Learning",
      score: "84%",
      level: "Good",
    },
    {
      name: "Data Structures",
      score: "81%",
      level: "Good",
    },
    {
      name: "Python Programming",
      score: "90%",
      level: "Excellent",
    },
    {
      name: "Mathematics",
      score: "72%",
      level: "Average",
    },
    {
      name: "Computer Networks",
      score: "86%",
      level: "Good",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-8 md:p-10">
      <div className="max-w-6xl mx-auto">

        <a
          href="/"
          className="inline-flex items-center text-blue-600 font-medium hover:underline"
        >
          ← Back to Dashboard
        </a>

        <div className="mt-6">
          <h1 className="text-4xl font-bold text-slate-900">
            Academics
          </h1>

          <p className="text-slate-500 mt-2">
            Academic performance and subject-wise progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <SummaryCard
            title="Overall Score"
            value="82%"
            description="Above average"
          />

          <SummaryCard
            title="Current CGPA"
            value="8.2"
            description="Good academic standing"
          />

          <SummaryCard
            title="Subjects"
            value="6"
            description="Active subjects"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Subject Performance
          </h2>

          <p className="text-slate-500 mt-1">
            Current academic performance by subject
          </p>

          <div className="mt-6 space-y-4">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="border border-slate-200 rounded-xl p-5"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {subject.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {subject.level}
                    </p>
                  </div>

                  <span className="text-xl font-bold text-blue-600">
                    {subject.score}
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: subject.score }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">
          <h2 className="text-xl font-bold text-blue-700">
            Academic Insight
          </h2>

          <p className="text-slate-700 mt-2 leading-relaxed">
            Your overall academic performance is above average.
            Python Programming and Artificial Intelligence are
            strong areas. Mathematics shows room for improvement,
            so additional practice can help improve your overall
            academic score.
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
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <p className="text-slate-500">
        {title}
      </p>

      <p className="text-4xl font-bold text-blue-600 mt-3">
        {value}
      </p>

      <p className="text-sm text-slate-500 mt-2">
        {description}
      </p>
    </div>
  );
}