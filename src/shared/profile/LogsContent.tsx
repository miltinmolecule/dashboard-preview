import StatusBadge from "@/shared/common/StatusBadge";
import SimplePagination from "./SimplePagination";
import type { LogRecord } from "./types";

export default function LogsContent({ logs }: { logs: LogRecord[] }): React.ReactNode {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-5">User Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["ID", "Title", "Date | Time", "Status", "Purpose", "Action"].map((h) => (
                <th key={h} className="pb-3 text-left text-xs font-semibold text-gray-500 pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="py-3 pr-4 text-xs font-mono text-gray-700">{log.id}</td>
                <td className="py-3 pr-4 text-sm text-gray-700">{log.title}</td>
                <td className="py-3 pr-4 text-xs text-gray-500">{log.dateTime}</td>
                <td className="py-3 pr-4"><StatusBadge status={log.status} /></td>
                <td className="py-3 pr-4 text-sm text-gray-600">{log.purpose}</td>
                <td className="py-3 text-xs font-medium text-[#1e3a4c] hover:underline cursor-pointer">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SimplePagination totalPages={Math.ceil(logs.length / 10) || 1} />
    </div>
  );
}
