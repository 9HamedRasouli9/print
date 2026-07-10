import { useState, useEffect } from "react";
import {
  Search,
  Play,
  Pause,
  Square,
  FileText,
  Loader2,
} from "lucide-react";
import { printJobsApi, apiRequest } from "../services/api/index";
import { toShamsi } from "../utils/shamsiDate";

const statusLabels = {
  printing: "در حال چاپ",
  queued: "در صف",
  completed: "تکمیل شده",
  paused: "متوقف",
  error: "خطا",
};

export default function PrintJobs() {
  const [printJobs, setPrintJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPrintJobs = async () => {
      const result = await apiRequest(() => printJobsApi.getAll());
      if (result.success) setPrintJobs(result.data);
      setLoading(false);
    };
    fetchPrintJobs();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "printing":
        return "bg-blue-100 text-blue-800";
      case "queued":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "printing":
        return <Play className="w-4 h-4" />;
      case "queued":
        return <FileText className="w-4 h-4" />;
      case "completed":
        return <Square className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredJobs = printJobs.filter((job) => {
    const search = searchTerm.toLowerCase();
    return (
      (job.jobName || "").toLowerCase().includes(search) ||
      (job.customer?.fullName || "").toLowerCase().includes(search) ||
      (job.jobNumber || "").toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-md:p-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">کارهای چاپ</h1>
            <p className="text-gray-600 mt-2">نظارت و مدیریت تمام کارهای چاپ در صف</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="جستجوی کارهای چاپ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Print Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">کار چاپی یافت نشد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.jobName}</h3>
                  <p className="text-sm text-gray-500">شناسه: {job.jobNumber}</p>
                </div>
                <span
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}
                >
                  {getStatusIcon(job.status)}
                  {statusLabels[job.status] || job.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">مشتری:</span>
                  <span className="font-medium text-gray-900">
                    {job.customer?.fullName || "نامشخص"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">نسخه:</span>
                  <span className="font-medium text-gray-900">
                    {(job.copies || 0).toLocaleString("fa-IR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">صفحات:</span>
                  <span className="font-medium text-gray-900">
                    {(job.pages || 0).toLocaleString("fa-IR")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">زمان شروع:</span>
                  <span className="font-medium text-gray-900">
                    {job.startTime ? toShamsi(job.startTime) : "-"}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">پیشرفت</span>
                  <span className="font-medium text-gray-900">
                    {(job.progress || 0).toLocaleString("fa-IR")}٪
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${job.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {job.status === "queued" && (
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                    <Play className="w-4 h-4" />
                    شروع
                  </button>
                )}
                {job.status === "printing" && (
                  <button className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition text-sm">
                    <Pause className="w-4 h-4" />
                    توقف
                  </button>
                )}
                {job.status === "paused" && (
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                    <Play className="w-4 h-4" />
                    ادامه
                  </button>
                )}
                <button className="flex items-center justify-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
                  <Square className="w-4 h-4" />
                  لغو
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
