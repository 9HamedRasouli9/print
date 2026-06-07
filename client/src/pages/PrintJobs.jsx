import { useState } from "react";
import { Search, Filter, Plus, Play, Pause, Square, FileText } from "lucide-react";

const statusLabels = {
  printing: "در حال چاپ",
  queued: "در صف",
  completed: "تکمیل شده",
  paused: "متوقف",
  error: "خطا",
};

export default function PrintJobs() {
  const [printJobs] = useState([
    {
      id: "PJ-001",
      jobName: "کارت ویزیت - John Doe",
      customer: "John Doe",
      status: "printing",
      progress: 65,
      copies: 100,
      pages: 50,
      startTime: "2024-01-15 10:30 AM"
    },
    {
      id: "PJ-002",
      jobName: "بروشور - Jane Smith", 
      customer: "Jane Smith",
      status: "queued",
      progress: 0,
      copies: 250,
      pages: 12,
      startTime: "2024-01-15 11:00 AM"
    },
    {
      id: "PJ-003",
      jobName: "فلایر - Bob Johnson",
      customer: "Bob Johnson", 
      status: "completed",
      progress: 100,
      copies: 500,
      pages: 1,
      startTime: "2024-01-15 09:15 AM"
    },
    {
      id: "PJ-004",
      jobName: "کاتالوگ - Alice Brown",
      customer: "Alice Brown",
      status: "paused",
      progress: 35,
      copies: 100,
      pages: 24,
      startTime: "2024-01-15 10:45 AM"
    }
  ]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'printing': return 'bg-blue-100 text-blue-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'printing': return <Play className="w-4 h-4" />;
      case 'queued': return <FileText className="w-4 h-4" />;
      case 'completed': return <Square className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">کارهای چاپ</h1>
            <p className="text-gray-600 mt-2">نظارت و مدیریت تمام کارهای چاپ در صف</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            <Plus className="w-5 h-5" />
            کار چاپ جدید
          </button>
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
              className="w-full ps-10 pe-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter className="w-5 h-5" />
            فیلتر
          </button>
        </div>
      </div>

      {/* Print Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {printJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{job.jobName}</h3>
                <p className="text-sm text-gray-500">شناسه: {job.id}</p>
              </div>
              <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                {getStatusIcon(job.status)}
                {statusLabels[job.status] || job.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">مشتری:</span>
                <span className="font-medium text-gray-900">{job.customer}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">نسخه:</span>
                <span className="font-medium text-gray-900">{job.copies.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">صفحات:</span>
                <span className="font-medium text-gray-900">{job.pages.toLocaleString("fa-IR")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">زمان شروع:</span>
                <span className="font-medium text-gray-900">{job.startTime}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">پیشرفت</span>
                <span className="font-medium text-gray-900">{job.progress.toLocaleString("fa-IR")}٪</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${job.progress}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {job.status === 'queued' && (
                <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                  <Play className="w-4 h-4" />
                  شروع
                </button>
              )}
              {job.status === 'printing' && (
                <button className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition text-sm">
                  <Pause className="w-4 h-4" />
                  توقف
                </button>
              )}
              {job.status === 'paused' && (
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
    </div>
  );
}
