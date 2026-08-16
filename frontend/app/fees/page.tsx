export default function FeesPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900">Fees Details</h1>

      <p className="mt-2 text-slate-500">
        View your fee details and payment status.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-slate-500">Total Fees</p>
          <h2 className="mt-2 text-3xl font-bold">₹85,000</h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-slate-500">Paid Amount</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            ₹60,000
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border">
          <p className="text-sm text-slate-500">Pending Amount</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            ₹25,000
          </h2>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-6 shadow-sm border">
        <h2 className="text-xl font-bold mb-5">Payment Details</h2>

        <div className="space-y-4">
          <div className="flex justify-between border-b pb-4">
            <span>Tuition Fees</span>
            <span className="font-semibold">₹50,000</span>
          </div>

          <div className="flex justify-between border-b pb-4">
            <span>Lab Fees</span>
            <span className="font-semibold">₹15,000</span>
          </div>

          <div className="flex justify-between border-b pb-4">
            <span>Examination Fees</span>
            <span className="font-semibold">₹10,000</span>
          </div>

          <div className="flex justify-between">
            <span>Other Fees</span>
            <span className="font-semibold">₹10,000</span>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-yellow-50 p-4">
          <p className="font-semibold">Next Due Date</p>
          <p className="text-sm text-slate-600 mt-1">
            15 September 2026
          </p>
        </div>
      </div>
    </main>
  );
}