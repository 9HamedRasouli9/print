import { useState } from "react";
import { Users, FileText, TrendingUp, DollarSign } from "lucide-react";

export default function OwnerDashboard() {
  const [stats] = useState({
    totalCustomers: 156,
    totalInvoices: 89,
    revenue: 45678,
    growth: 12.5
  });

  const statCards = [
    {
      title: "کل مشتریان",
      value: stats.totalCustomers.toLocaleString("fa-IR"),
      icon: Users,
      color: "bg-blue-500",
      change: "+۸ این ماه"
    },
    {
      title: "کل فاکتورها",
      value: stats.totalInvoices.toLocaleString("fa-IR"),
      icon: FileText,
      color: "bg-green-500",
      change: "+۱۲ این ماه"
    },
    {
      title: "درآمد",
      value: `${stats.revenue.toLocaleString("fa-IR")} افغانی`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: `+${stats.growth.toLocaleString("fa-IR")}٪ این ماه`
    },
    {
      title: "نرخ رشد",
      value: `${stats.growth.toLocaleString("fa-IR")}٪`,
      icon: TrendingUp,
      color: "bg-purple-500",
      change: "+۲.۳٪ نسبت به ماه قبل"
    }
  ];

  return (
    <div className="p-8 max-md:p-4">
      <div className="mb-8 max-md:mb-6">
        <h1 className="text-3xl font-bold text-gray-900 max-md:text-2xl">داشبورد</h1>
        <p className="text-gray-600 mt-2">خوش آمدید! نمای کلی از کسب‌وکار شما.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">فاکتورهای اخیر</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">INV-00{item}</p>
                    <p className="text-sm text-gray-500">مشتری {item.toLocaleString("fa-IR")}</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="font-medium text-gray-900">{(item * 234).toLocaleString("fa-IR")} افغانی</p>
                  <p className="text-sm text-gray-500">۲ روز پیش</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">مشتریان اخیر</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">مشتری {item.toLocaleString("fa-IR")}</p>
                    <p className="text-sm text-gray-500">customer{item}@email.com</p>
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-sm font-medium text-gray-900">فعال</p>
                  <p className="text-sm text-gray-500">{item.toLocaleString("fa-IR")} روز پیش عضو شد</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
