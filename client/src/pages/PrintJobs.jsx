import { useState } from "react";
import { Printer, Search, Filter, Plus, Play, Pause, CheckCircle, Clock, AlertCircle } from "lucide-react";

const printJobsData = [
  { id: "#JOB-001", orderId: "#ORD-001", type: "Business Cards", printer: "Printer A", status: "Completed", progress: 100, started: "09:00 AM", completed: "09:15 AM" },
  { id: "#JOB-002", orderId: "#ORD-002", type: "Flyers", printer: "Printer B", status: "Printing", progress: 65, started: "10:30 AM", completed: "-" },
  { id: "#JOB-003", orderId: "#ORD-003", type: "Brochures", printer: "Printer C", status: "Queued", progress: 0, started: "-", completed: "-" },
  { id: "#JOB-004", orderId: "#ORD-005", type: "Banners", printer: "Printer D", status: "Printing", progress: 30, started: "11:00 AM", completed: "-" },
  { id: "#JOB-005", orderId: "#ORD-006", type: "Stickers", printer: "Printer A", status: "Paused", progress: 45, started: "10:45 AM", completed: "-" },
  { id: "#JOB-006", orderId: "#ORD-004", type: "Posters", printer: "Printer B", status: "Completed", progress: 100, started: "08:30 AM", completed: "09:45 AM" },
];

const statusConfig = {
  Completed: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  Printing: { color: "bg-blue-100 text-blue-700", icon: Printer },
  Queued: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  Paused: { color: "bg-orange-100 text-orange-700", icon: Pause },
  Error: { color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function PrintJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredJobs = printJobsData.filter(job => {
    const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    const Icon = statusConfig[status]?.icon || Clock;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Print Jobs</h1>
          <p className="text-gray-500 mt-1">Monitor and manage print queue</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            2 Active Printers
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            <Plus className="w-5 h-5" />
            Add Job
          </button>
        </div>
      </div>

      {/* Printer Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["Printer A", "Printer B", "Printer C", "Printer D"].map((printer, index) => (
          <div key={printer} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{printer}</span>
              <div className={`w-2 h-2 rounded-full ${index < 2 ? "bg-green-500" : "bg-gray-300"}`}></div>
            </div>
            <p className="text-sm text-gray-500">{index < 2 ? "Printing..." : "Idle"}</p>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${index < 2 ? "bg-blue-500" : "bg-gray-300"} transition-all`} style={{ width: index === 0 ? "65%" : index === 1 ? "30%" : "0%" }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search print jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Printing">Printing</option>
            <option value="Queued">Queued</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
            <option value="Error">Error</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Printer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{job.printer}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusConfig[job.status].color}`}>
                      {getStatusIcon(job.status)}
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${job.progress}%` }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{job.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.started}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      {job.status === "Printing" && (
                        <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition" title="Pause">
                          <Pause className="w-4 h-4" />
                        </button>
                      )}
                      {job.status === "Paused" && (
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Resume">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      {job.status === "Queued" && (
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Start">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
