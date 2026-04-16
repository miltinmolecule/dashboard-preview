import StatusBadge from "@/shared/common/StatusBadge";
import SimplePagination from "./SimplePagination";
import type { TransactionRecord } from "./types";

interface TransactionsContentProps {
  transactions: TransactionRecord[];
  walletBalance: number;
  totalSpent: number;
  pendingPayment: number;
  totalTrips: number;
}

export default function TransactionsContent({
  transactions,
  walletBalance,
  totalSpent,
  pendingPayment,
  totalTrips,
}: TransactionsContentProps): React.ReactNode {
  const stats = [
    { label: "Wallet Balance", value: `₦${walletBalance.toLocaleString()}` },
    { label: "Total Spent", value: `₦${totalSpent.toLocaleString()}` },
    { label: "Pending Payment", value: `₦${pendingPayment.toLocaleString()}` },
    { label: "Total Trips", value: totalTrips.toLocaleString() },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
            <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center mb-2">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Transaction ID", "From", "Estimated Fare", "Date | Time", "Status", "Purpose", "Action"].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="py-3 pr-4 text-xs font-mono text-gray-700">{tx.id}</td>
                  <td className="py-3 pr-4 text-sm text-gray-700">{tx.from}</td>
                  <td className="py-3 pr-4 text-sm font-medium text-gray-900">₦{tx.estimatedFare.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-xs text-gray-500">{tx.dateTime}</td>
                  <td className="py-3 pr-4"><StatusBadge status={tx.status} /></td>
                  <td className="py-3 pr-4 text-sm text-gray-600">{tx.purpose}</td>
                  <td className="py-3 text-xs font-medium text-[#1e3a4c] hover:underline cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SimplePagination totalPages={Math.ceil(transactions.length / 10) || 1} />
      </div>
    </div>
  );
}
