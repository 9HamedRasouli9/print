import { useState, useEffect } from "react";
import { Users, FileText, TrendingUp, DollarSign, ArrowDownLeft } from "lucide-react";
import { customersApi, transactionsApi, apiRequest } from "../services/api/index";
import { toShamsi } from "../utils/shamsiDate";

const formatNumber = (num) => {
  const n = parseFloat(String(num).replace(/,/g, "")) || 0;
  return n.toLocaleString("fa-IR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default function OwnerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [custRes, txRes] = await Promise.all([
        apiRequest(() => customersApi.getAll()),
        apiRequest(() => transactionsApi.getAll()),
      ]);
      if (custRes.success) setCustomers(custRes.data);
      if (txRes.success) setTransactions(txRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalCustomers = customers.length;

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const revenue = totalCredit - totalDebit;

  const recentTransactions = transactions
    .filter((t) => t.type === "credit")
    .slice(0, 5);
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  const statCards = [
    {
      title: "کل مشتریان",
      value: formatNumber(totalCustomers),
      icon: Users,
      color: "bg-blue-500",
      change: `${formatNumber(customers.filter(c => {
        const created = c.createdAt ? new Date(c.createdAt) : null;
        if (!created) return false;
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created >= monthAgo;
      }).length)}+ این ماه`,
    },
    {
      title: "کل تراکنش‌ها",
      value: formatNumber(transactions.length),
      icon: FileText,
      color: "bg-green-500",
      change: `${formatNumber(transactions.filter(t => {
        const d = new Date(t.date || t.createdAt || 0);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return d >= monthAgo;
      }).length)}+ این ماه`,
    },
    {
      title: "درآمد خالص",
      value: `${formatNumber(revenue)} افغانی`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: revenue >= 0 ? "مثبت" : "منفی",
    },
    {
      title: "میانگین تراکنش",
      value: `${formatNumber(transactions.length ? Math.round(revenue / transactions.length) : 0)} افغانی`,
      icon: TrendingUp,
      color: "bg-purple-500",
      change: `${formatNumber(customers.length ? Math.round(totalCredit / customers.length) : 0)} افغانی به ازای هر مشتری`,
    },
  ];

  if (loading) {
    return (
      <div className="p-8 max-md:p-4 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">تراکنش‌های دریافتی اخیر</h2>
          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">تراکنشی وجود ندارد</p>
            ) : (
              recentTransactions.map((t) => (
                <div key={t._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <ArrowDownLeft className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.description || "بدون توضیحات"}</p>
                      <p className="text-sm text-gray-500">{toShamsi(t.date)}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="font-medium text-green-600">+{formatNumber(t.amount)} افغانی</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">مشتریان اخیر</h2>
          <div className="space-y-3">
            {recentCustomers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">مشتری وجود ندارد</p>
            ) : (
              recentCustomers.map((c) => (
                <div key={c._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{c.fullName}</p>
                      <p className="text-sm text-gray-500">{c.contact || "بدون تلفن"}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-medium text-gray-900">{formatNumber(c.accountBalance || 0)} افغانی</p>
                    <p className="text-sm text-gray-500">
                      {c.createdAt ? toShamsi(c.createdAt) : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
