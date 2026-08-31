import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Filter,
  Plus,
  Phone,
  MoreHorizontal,
  Edit,
  Trash2,
  User,
  Users,
  ArrowLeftRight,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  ArrowUpDown,
  FileText,
  Printer,
  Hash,
  CheckCircle,
  X,
  CreditCard,
} from "lucide-react";
import PopupScreen from "../components/PopupScreen";
import PopupMessage from "../components/PopupMessage";
import ShamsiDatePicker from "../components/ShamsiDatePicker";
import { customersApi, transactionsApi, invoicesApi, apiRequest } from "../services/api/index";
import useCustomer from "../hooks/useCustomer";
import useTransaction from "../hooks/useTransaction";
import useInvoiceSettings from "../hooks/useInvoiceSettings";
import {
  todayShamsi,
  toShamsi,
  shamsiToGregorian,
  shamsiToDate,
} from "../utils/shamsiDate";
import { Invoice } from "../components/invoice";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const toCustomerPayload = (formData) => ({
  fullName: formData.fullName,
  contact: formData.contact,
  accountBalance: parseFloat(formData.account) || 0,
});

const formatNumber = (num) => {
  const n = parseFloat(String(num).replace(/,/g, "")) || 0;
  return n.toLocaleString("fa-IR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [isAdding, setIsAddingOrEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { customersData, refetchCustomers } = useCustomer();
  const { transactions, refetchTransactions } = useTransaction();
  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    account: 0,
  });
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [transactionCustomer, setTransactionCustomer] = useState(null);
  const [transactionData, setTransactionData] = useState({
    amount: "",
    description: "",
    type: "credit",
    date: todayShamsi(),
  });
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoiceCustomer, setInvoiceCustomer] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    items: [{ description: "", count: 1, kilo: "", unit: "کیلو", unitPrice: "" }],
    invoiceNumber: "",
    dueDate: "",
    paidAmount: "",
    discount: "",
    description: "",
  });
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);
  const { settings: invoiceSettings } = useInvoiceSettings();

  useEffect(() => {
    if (viewingCustomer) {
      const updatedCustomer = customersData.find(
        (c) => c._id === viewingCustomer._id,
      );
      if (updatedCustomer) {
        setViewingCustomer(updatedCustomer);
      }
    }
  }, [customersData, viewingCustomer?._id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = toCustomerPayload(formData);

    const result = editingId
      ? await apiRequest(() => customersApi.update(editingId, payload))
      : await apiRequest(() => customersApi.create(payload));

    if (result.success) {
      await refetchCustomers();
      setFormData({ fullName: "", contact: "", account: 0 });
      setEditingId(null);
      setIsAddingOrEditing(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    const result = await apiRequest(() => customersApi.delete(deleteId));
    if (result.success) {
      await refetchCustomers();
    }
    setDeleteId(null);
  };

  const handleEdit = (id) => {
    const customerData = customersData.find((customer) => customer._id === id);
    if (!customerData) return;
    setFormData({
      fullName: customerData.fullName,
      contact: customerData.contact,
      account: customerData.accountBalance ?? 0,
    });
    setEditingId(id);
    setIsAddingOrEditing(true);
  };

  const handleTransaction = (customer) => {
    setTransactionCustomer(customer);
    setTransactionData({
      amount: "",
      description: "",
      type: "credit",
      date: todayShamsi(),
    });
    setIsTransactionOpen(true);
    setOpenMenuId(null);
  };

  const handleInvoice = (customer) => {
    setInvoiceCustomer(customer);
    setInvoiceData({
      items: [{ description: "", count: 1, kilo: "", unit: "کیلو", unitPrice: "" }],
      invoiceNumber: "",
      dueDate: todayShamsi(),
      paidAmount: "",
      discount: "",
      description: "",
    });
    setInvoiceSuccess(false);
    setIsInvoiceOpen(true);
    setOpenMenuId(null);
  };

  // Compute invoice subtotal from items (before discount)
  const computeInvoiceSubtotal = (items) =>
    items.reduce((sum, item) => {
      const kilo = parseFloat(String(item.kilo).replace(/,/g, "")) || 0;
      const count = parseInt(item.count) || 0;
      const qty = kilo > 0 ? kilo : count;
      const price = parseFloat(String(item.unitPrice).replace(/,/g, "")) || 0;
      return sum + qty * price;
    }, 0);

  // Compute invoice net total (subtotal - discount)
  const computeInvoiceTotal = (items, discount = 0) => {
    const subtotal = computeInvoiceSubtotal(items);
    const net = subtotal - discount;
    return net > 0 ? net : 0;
  };

  const handleInvoiceItemChange = (index, field, value) => {
    const newItems = [...invoiceData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const handleAddInvoiceItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [          ...invoiceData.items,
        { description: "", count: 1, kilo: "", unit: "کیلو", unitPrice: "" },
      ],
    });
  };

  const handleRemoveInvoiceItem = (index) => {
    if (invoiceData.items.length <= 1) return;
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const handlePrintInvoice = () => {
    const originalTitle = document.title;
    const favicon = document.querySelector('link[rel="icon"]');
    const originalFaviconHref = favicon?.getAttribute('href');

    // Remove favicon and clear title to hide browser print headers
    if (favicon) favicon.setAttribute('href', 'data:,');
    document.title = '';

    // Delay slightly so the DOM updates take effect
    setTimeout(() => {
      window.print();
      // Restore after print dialog closes
      setTimeout(() => {
        document.title = originalTitle;
        if (favicon && originalFaviconHref) favicon.setAttribute('href', originalFaviconHref);
      }, 100);
    }, 50);
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    const items = invoiceData.items
      .filter((item) => item.description.trim())
      .map((item) => {
        const kilo = parseFloat(String(item.kilo).replace(/,/g, "")) || 0;
        const count = parseInt(item.count) || 0;
        const unitPrice = parseFloat(String(item.unitPrice).replace(/,/g, "")) || 0;
        return {
          description: item.description.trim(),
          kilo,
          count,
          // For server backward compatibility: effective quantity
          quantity: kilo > 0 ? kilo : count,
          unit: item.unit || "کیلو",
          unitPrice,
        };
      });

    if (items.length === 0) return;

    const discount =
      parseFloat(String(invoiceData.discount).replace(/,/g, "")) || 0;
    const paidAmount =
      parseFloat(String(invoiceData.paidAmount).replace(/,/g, "")) || 0;

    const payload = {
      customer: invoiceCustomer._id,
      items,
      discount,
      paidAmount,
      invoiceNumber: invoiceData.invoiceNumber.trim() || undefined,
      dueDate: invoiceData.dueDate
        ? shamsiToGregorian(invoiceData.dueDate)
        : new Date().toISOString().split("T")[0],
      description: invoiceData.description,
    };

    const result = await apiRequest(() => invoicesApi.create(payload));

    if (result.success) {
      setInvoiceSuccess(true);
      // Update with server-confirmed invoice number
      if (result.data?.invoiceNumber) {
        setInvoiceData(prev => ({ ...prev, invoiceNumber: result.data.invoiceNumber }));
      }
      if (paidAmount > 0) {
        await refetchCustomers();
      }
      setTimeout(() => {
        setIsInvoiceOpen(false);
        setInvoiceCustomer(null);
        setInvoiceSuccess(false);
      }, 1200);
    }
  };

  const handleTransactionInputChange = (e) => {
    setTransactionData({ ...transactionData, [e.target.name]: e.target.value });
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    const amount = parseFloat(transactionData.amount.replace(/,/g, ""));
    if (isNaN(amount) || amount <= 0) return;

    const payload = {
      amount,
      type: transactionData.type,
      description: transactionData.description,
      date: transactionData.date
        ? shamsiToGregorian(transactionData.date)
        : new Date().toISOString().split("T")[0],
    };

    const result = editingTransactionId
      ? await apiRequest(() =>
          transactionsApi.update(editingTransactionId, payload),
        )
      : await apiRequest(() =>
          transactionsApi.create({
            ...payload,
            customerId: transactionCustomer._id,
          }),
        );

    if (result.success) {
      await Promise.all([refetchCustomers(), refetchTransactions()]);
      setEditingTransactionId(null);
      setIsTransactionOpen(false);
      setTransactionCustomer(null);
      setTransactionData({
        amount: "",
        description: "",
        type: "credit",
        date: todayShamsi(),
      });
    }
  };

  const handleViewCustomer = (customer) => {
    setViewingCustomer(customer);
    setTransactionFilter("all");
    setDateRange({ start: "", end: "" });
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransactionId(transaction._id);
    setTransactionData({
      amount: transaction.amount.toLocaleString(),
      description: transaction.description,
      type: transaction.type,
      date: toShamsi(transaction.date),
    });
    setTransactionCustomer(
      customersData.find((c) => c._id === transaction.customer),
    );
    setIsTransactionOpen(true);
  };

  const handleDeleteTransaction = (transactionId) => {
    setDeleteTransactionId(transactionId);
  };

  const confirmDeleteTransaction = async () => {
    const result = await apiRequest(() =>
      transactionsApi.delete(deleteTransactionId),
    );
    if (result.success) {
      await Promise.all([refetchCustomers(), refetchTransactions()]);
    }
    setDeleteTransactionId(null);
  };

  const getCustomerTransactions = (customerId) => {
    return transactions.filter((t) => t.customer === customerId);
  };

  const getFilteredTransactions = (customerId) => {
    let customerTransactions = getCustomerTransactions(customerId);
    if (transactionFilter !== "all") {
      customerTransactions = customerTransactions.filter(
        (t) => t.type === transactionFilter,
      );
    }
    if (dateRange.start) {
      const startDate = shamsiToDate(dateRange.start);
      customerTransactions = customerTransactions.filter(
        (t) => new Date(t.date) >= startDate,
      );
    }
    if (dateRange.end) {
      const endDate = shamsiToDate(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      customerTransactions = customerTransactions.filter(
        (t) => new Date(t.date) <= endDate,
      );
    }
    return customerTransactions;
  };

  const getCustomerStats = (customerId) => {
    const customerTransactions = getCustomerTransactions(customerId);
    const totalReceived = customerTransactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalGiven = customerTransactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalReceived, totalGiven };
  };

  const filteredCustomers = customersData
    .filter((customer) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        customer.fullName?.toLowerCase().includes(searchLower) ||
        customer.contact?.toLowerCase().includes(searchLower);

      const balance = parseFloat(customer.accountBalance ?? 0);
      const matchesBalance =
        balanceFilter === "all" ||
        (balanceFilter === "positive" && balance > 0) ||
        (balanceFilter === "zero" && balance === 0) ||
        (balanceFilter === "negative" && balance < 0);

      return matchesSearch && matchesBalance;
    })
    .sort((a, b) => {
      const balanceA = parseFloat(a.accountBalance ?? 0);
      const balanceB = parseFloat(b.accountBalance ?? 0);
      if (sortOrder === "highest") return balanceB - balanceA;
      if (sortOrder === "lowest") return balanceA - balanceB;
      return 0;
    });

  const totalCustomers = customersData.length;

  // Derive Invoice print data from the current invoice editing state
  const invoicePrintData = isInvoiceOpen ? {
    headerEntries: invoiceSettings.headerEntries,
    customer: invoiceCustomer?.fullName || "-",
    date: invoiceData.dueDate || todayShamsi(),
    invoiceNumber: invoiceData.invoiceNumber || "______",
    previousDebt: parseFloat(invoiceCustomer?.accountBalance || 0),
    paid: parseFloat(String(invoiceData.paidAmount).replace(/,/g, "")) || 0,
    items: invoiceData.items
      .filter((item) => item.description.trim())
      .map((item) => {
        const kilo = parseFloat(String(item.kilo).replace(/,/g, "")) || 0;
        const count = parseInt(item.count) || 0;
        const price = parseFloat(String(item.unitPrice).replace(/,/g, "")) || 0;
        const qty = kilo > 0 ? kilo : count;
        return {
          description: item.description,
          count,
          kilo,
          unit: item.unit || "کیلو",
          price,
          amount: qty * price,
        };
      }),
    address: invoiceSettings.address,
    logo: invoiceSettings.logo,
    logoPosition: invoiceSettings.logoPosition,
    logoAlign: invoiceSettings.logoAlign,
    headerColor: invoiceSettings.headerColor,
    backgroundColor: invoiceSettings.backgroundColor,
    textColor: invoiceSettings.textColor,
  } : null;

  return (
    <>
      <div className="p-3 sm:p-4 flex flex-col gap-3 h-full min-h-0 max-md:h-auto max-md:pb-20">
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {totalCustomers}
                </p>
                <p className="text-gray-500 text-[10px] sm:text-xs">کل مشتریان</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAddingOrEditing(!isAdding);
              setEditingId(null);
              setFormData({ fullName: "", contact: "", account: 0 });
            }}
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-indigo-700 transition shrink-0 xl:hidden cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="sm:hidden">افزودن</span>
            <span className="hidden sm:inline">افزودن مشتری</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4">
          <div className="flex flex-col gap-2 sm:gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا تلفن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full ps-9 sm:ps-10 pe-3 sm:pe-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2 xl:shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 hidden sm:block" />
                <select
                  value={balanceFilter}
                  onChange={(e) => setBalanceFilter(e.target.value)}
                  className="w-full min-w-0 px-2 sm:px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="all">همه مشتریان</option>
                  <option value="positive">موجودی مثبت</option>
                  <option value="zero">بدون موجودی</option>
                  <option value="negative">موجودی منفی</option>
                </select>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <ArrowUpDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0 hidden sm:block" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full min-w-0 px-2 sm:px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                  <option value="default">پیش‌فرض</option>
                  <option value="highest">بیشترین موجودی</option>
                  <option value="lowest">کمترین موجودی</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                setIsAddingOrEditing(!isAdding);
                setEditingId(null);
                setFormData({ fullName: "", contact: "", account: 0 });
              }}
              className="hidden xl:flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition shrink-0 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              افزودن مشتری
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Customer Cards */}
      <div className="lg:hidden flex-1 min-h-0 overflow-y-auto space-y-2 -mx-1 px-1">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">مشتری یافت نشد</p>
            <p className="text-sm text-gray-400 mt-1">
              جستجو یا فیلترها را تغییر دهید
            </p>
          </div>
        ) : (
          filteredCustomers.map((customer, index) => (
            <div
              key={customer._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => handleViewCustomer(customer)}
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium text-indigo-600">
                    {getInitials(customer.fullName)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {customer.fullName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span dir="ltr" className="text-xs truncate text-start">
                      {customer.contact}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-2">
                    {formatNumber(customer.accountBalance)}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">#{index + 1}</span>
              </div>
              <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(customer._id)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition cursor-pointer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === customer._id ? null : customer._id,
                      )
                    }
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {openMenuId === customer._id && (
                    <div className="absolute end-0 bottom-full mb-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                      <button
                        onClick={() => handleTransaction(customer)}
                        className="w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                        تراکنش
                      </button>
                      <button
                        onClick={() => handleInvoice(customer)}
                        className="w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-indigo-600" />
                        فاکتور
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 min-h-0 hidden lg:flex lg:flex-col">
        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 xl:px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ردیف
                </th>
                <th className="px-4 xl:px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  مشتری
                </th>
                <th className="px-4 xl:px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تلفن
                </th>
                <th className="px-4 xl:px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حساب
                </th>
                <th className="px-4 xl:px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer, index) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {getInitials(customer.fullName)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition">
                          {customer.fullName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span dir="ltr" className="text-sm text-gray-600 text-start">
                        {customer.contact}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatNumber(customer.accountBalance)}
                  </td>
                  <td className="px-4 xl:px-6 py-4 whitespace-nowrap relative">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleEdit(customer._id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          handleDelete(customer._id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === customer._id ? null : customer._id,
                            )
                          }
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {openMenuId === customer._id && (
                          <div className="absolute end-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            <button
                              onClick={() => handleTransaction(customer)}
                              className="w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                              تراکنش
                            </button>
                            <button
                              onClick={() => handleInvoice(customer)}
                              className="w-full px-4 py-2 text-start text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4 text-indigo-600" />
                              فاکتور
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

            {filteredCustomers.length === 0 && (
              <tbody className="text-center">
                <tr>
                  <td colSpan={5} className="pt-10">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">مشتری یافت نشد</p>
                    <p className="text-sm text-gray-400 mt-1">
                      جستجو یا فیلترها را تغییر دهید
                    </p>
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      <PopupMessage
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="تایید حذف"
        message={`آیا از حذف «${customersData.find((c) => c._id == deleteId)?.fullName}» مطمئن هستید؟`}
        type="warning"
        primaryLabel="حذف"
        primaryAction={confirmDelete}
        secondaryLabel="لغو"
        secondaryAction={() => setDeleteId(null)}
      />

      <PopupMessage
        isOpen={deleteTransactionId !== null}
        onClose={() => setDeleteTransactionId(null)}
        title="تایید حذف"
        message="آیا از حذف این تراکنش مطمئن هستید؟"
        type="warning"
        primaryLabel="حذف"
        primaryAction={confirmDeleteTransaction}
        secondaryLabel="لغو"
        secondaryAction={() => setDeleteTransactionId(null)}
      />

      {isAdding && (
        <PopupScreen isShowing={isAdding} setIsShowing={setIsAddingOrEditing}>
          <div className="w-full max-w-sm sm:max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {editingId ? "ویرایش مشتری" : "افزودن مشتری جدید"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {editingId
                ? "اطلاعات مشتری را در زیر ویرایش کنید."
                : "برای افزودن مشتری جدید، جزئیات را وارد کنید."}
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام کامل
                </label>
                <div className="flex items-center gap-3 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
                  <User className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    className="flex-1 min-w-0 bg-transparent outline-none"
                    placeholder="نام کامل را وارد کنید"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تماس
                </label>
                <div className="flex items-center gap-3 w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
                  <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="tel"
                    dir="ltr"
                    className="flex-1 min-w-0 bg-transparent outline-none text-start"
                    placeholder="شماره تلفن را وارد کنید"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  موجودی حساب
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="0.00"
                    name="account"
                    value={formData.account}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingOrEditing(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                >
                  لغو
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                >
                  {editingId ? (
                    <Edit className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {editingId ? "ویرایش" : "افزودن مشتری"}
                </button>
              </div>
            </form>
          </div>
        </PopupScreen>
      )}

      {viewingCustomer && (
        <PopupScreen
          isShowing={!!viewingCustomer}
          setIsShowing={() => setViewingCustomer(null)}
          zIndex={40}
        >
          <div className="w-full max-w-[600px] max-h-[80vh] flex flex-col">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pe-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg sm:text-xl font-medium text-indigo-600">
                  {getInitials(viewingCustomer.fullName)}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {viewingCustomer.fullName}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span dir="ltr" className="text-start truncate">
                    {viewingCustomer.contact}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-600">موجودی</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {formatNumber(viewingCustomer.accountBalance)}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <ArrowDownLeft className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-600">دریافت شده</span>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {formatNumber(
                    getCustomerStats(viewingCustomer._id).totalReceived,
                  )}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <ArrowUpRight className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-gray-600">پرداخت شده</span>
                </div>
                <p className="text-lg font-bold text-red-600">
                  {formatNumber(
                    getCustomerStats(viewingCustomer._id).totalGiven,
                  )}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="flex flex-col gap-2 sm:gap-3 mb-3">
                <h3 className="text-base font-semibold text-gray-900">
                  تراکنش‌ها
                </h3>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    <ShamsiDatePicker
                      compact
                      placeholder="تاریخ شروع"
                      value={dateRange.start}
                      onChange={(start) => setDateRange({ ...dateRange, start })}
                    />
                    <span className="text-gray-400 text-xs">تا</span>
                    <ShamsiDatePicker
                      compact
                      placeholder="تاریخ پایان"
                      value={dateRange.end}
                      onChange={(end) => setDateRange({ ...dateRange, end })}
                    />
                    {(dateRange.start || dateRange.end) && (
                      <button
                        onClick={() => setDateRange({ start: "", end: "" })}
                        className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        پاک کردن
                      </button>
                    )}
                  </div>

                  <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
                    <button
                      onClick={() => setTransactionFilter("all")}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                        transactionFilter === "all"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      همه
                    </button>
                    <button
                      onClick={() => setTransactionFilter("credit")}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                        transactionFilter === "credit"
                          ? "bg-white text-green-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      دریافت شده
                    </button>
                    <button
                      onClick={() => setTransactionFilter("debit")}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                        transactionFilter === "debit"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      پرداخت شده
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-auto flex-1 min-h-0 border border-gray-200 rounded-lg">
                {getFilteredTransactions(viewingCustomer._id).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">تراکنشی یافت نشد</p>
                  </div>
                ) : (
                  <table className="w-full min-w-[520px]">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase w-12">
                          ردیف
                        </th>
                        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          تاریخ
                        </th>
                        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          نوع
                        </th>
                        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          مبلغ
                        </th>
                        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          توضیحات
                        </th>
                        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase">
                          عملیات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {getFilteredTransactions(viewingCustomer._id).map(
                        (t, index) => (
                          <tr key={t._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {toShamsi(t.date)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  t.type === "credit"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {t.type === "credit" ? (
                                  <ArrowDownLeft className="w-3 h-3" />
                                ) : (
                                  <ArrowUpRight className="w-3 h-3" />
                                )}
                                {t.type === "credit" ? "دریافت" : "پرداخت"}
                              </span>
                            </td>
                            <td
                              className={`px-4 py-3 text-sm font-medium ${
                                t.type === "credit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {t.type === "credit" ? "+" : "-"}
                              {formatNumber(t.amount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                              {t.description || "-"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditTransaction(t)}
                                  className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTransaction(t._id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </PopupScreen>
      )}

      {isTransactionOpen && (
        <PopupScreen
          isShowing={isTransactionOpen}
          setIsShowing={setIsTransactionOpen}
          zIndex={1000}
        >
          <div className="w-full max-w-xs sm:max-w-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {editingTransactionId ? "ویرایش تراکنش" : "تراکنش جدید"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {transactionCustomer?.fullName}
            </p>

            <form className="space-y-3 mt-4" onSubmit={handleTransactionSubmit}>
              <input
                type="text"
                inputMode="decimal"
                className="w-full px-4 py-3 text-2xl font-semibold text-center bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="0.00"
                name="amount"
                value={transactionData.amount}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                  const parts = rawValue.split(".");
                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                  const formatted = parts.join(".");
                  setTransactionData({ ...transactionData, amount: formatted });
                }}
                required
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setTransactionData({ ...transactionData, type: "credit" })
                  }
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    transactionData.type === "credit"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  + دریافت
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setTransactionData({ ...transactionData, type: "debit" })
                  }
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    transactionData.type === "debit"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  - پرداخت
                </button>
              </div>

              <ShamsiDatePicker
                value={transactionData.date}
                onChange={(date) =>
                  setTransactionData({ ...transactionData, date })
                }
              />

              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                placeholder="توضیحات (اختیاری)"
                name="description"
                value={transactionData.description}
                onChange={handleTransactionInputChange}
              />

              <button
                type="submit"
                className={`w-full py-3 rounded-lg font-semibold text-white transition cursor-pointer ${
                  transactionData.type === "credit"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {transactionData.type === "credit" ? "دریافت" : "پرداخت"}{" "}
                {formatNumber(transactionData.amount) || "0.00"}
              </button>
            </form>
          </div>
        </PopupScreen>
      )}

      {/* Invoice Popup */}
      {isInvoiceOpen && (
        <PopupScreen
          isShowing={isInvoiceOpen}
          setIsShowing={() => {
            setIsInvoiceOpen(false);
            setInvoiceCustomer(null);
            setInvoiceSuccess(false);
          }}
          zIndex={1000}
        >
          <div className="w-[90vw] max-w-6xl max-h-[90vh] flex flex-col print:hidden">
            {invoiceSuccess ? (
              <div className="flex flex-col items-center gap-3 py-8 animate-fadeIn">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-green-600">
                  فاکتور با موفقیت ثبت شد
                </p>
                {invoiceData.invoiceNumber && (
                  <p className="text-sm text-gray-500 mt-1">
                    شماره فاکتور: <span className="font-bold text-gray-700" dir="ltr">{invoiceData.invoiceNumber}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col min-h-0 overflow-hidden flex-1 gap-0">
                {/* Header */}
                <div className="flex items-center justify-between shrink-0 px-1 pe-14 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        فاکتور جدید
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Hash className="w-3 h-3 text-gray-400" />
                        <code className={`text-xs font-mono font-semibold ${invoiceData.invoiceNumber ? "text-indigo-600" : "text-gray-400"}`} dir="ltr">
                          {invoiceData.invoiceNumber || "______"}
                        </code>
                        <span className="text-gray-300">|</span>
                        <span className="font-medium text-gray-700">{invoiceCustomer?.fullName}</span>
                        <span className="text-gray-300">|</span>
                        <Wallet className="w-3 h-3" />
                        <span className={`font-semibold ${(invoiceCustomer?.accountBalance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatNumber(invoiceCustomer?.accountBalance || 0)}
                        </span>
                        <span>{invoiceCustomer && invoiceCustomer.accountBalance >= 0 ? "(بستانکار)" : "(بدهکار)"}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handlePrintInvoice}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition cursor-pointer shrink-0"
                    title="چاپ فاکتور"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">چاپ</span>
                  </button>
                </div>

                <form className="flex flex-col flex-1 min-h-0 gap-0 print:hidden" onSubmit={handleInvoiceSubmit}>
                  {/* Left-Right Split Main Content */}
                  <div className="flex flex-1 min-h-0 gap-2">
                    {/* Left Side: Factor Items */}
                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden border-l border-gray-100">
                      {/* Items Table Header with Add button */}
                      <div className="shrink-0 flex items-center justify-between px-2 py-2 border-b border-gray-100">
                        <div className="grid grid-cols-[28px_1fr_55px_55px_90px_80px] gap-1 text-xs font-medium text-gray-500 flex-1">
                          <span className="text-center">#</span>
                          <span>شرح</span>
                          <span className="text-center">تعداد</span>
                          <span className="text-center">کیلو</span>
                          <span className="text-center">قیمت</span>
                          <span className="text-center">جمع</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddInvoiceItem}
                          className="p-1.5 text-indigo-500 hover:text-white hover:bg-indigo-600 rounded-lg transition shrink-0 cursor-pointer"
                          title="افزودن قلم"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Items */}
                      <div className="flex-1 min-h-0 overflow-y-auto space-y-0.5 py-1">
                        {invoiceData.items.map((item, index) => {
                          const kiloVal = parseFloat(String(item.kilo).replace(/,/g, "")) || 0;
                          const countVal = parseInt(item.count) || 0;
                          const price = parseFloat(String(item.unitPrice).replace(/,/g, "")) || 0;
                          const qty = kiloVal > 0 ? kiloVal : countVal;
                          const lineTotal = qty * price;

                          return (
                            <div
                              key={index}
                              className="grid grid-cols-[28px_1fr_55px_55px_90px_80px_32px] gap-1 items-center px-2 py-1.5 rounded-lg hover:bg-gray-50 transition"
                            >
                              <span className="text-xs text-gray-400 text-center font-mono">{index + 1}</span>
                              <input
                                type="text"
                                className="w-full px-2 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                placeholder="شرح قلم..."
                                value={item.description}
                                onChange={(e) => handleInvoiceItemChange(index, "description", e.target.value)}
                              />
                              <input
                                type="number"
                                min="0"
                                className="w-full px-1 py-1.5 text-sm text-center bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                placeholder="تعداد"
                                value={item.count}
                                onChange={(e) => handleInvoiceItemChange(index, "count", e.target.value)}
                              />
                              <input
                                type="text"
                                inputMode="decimal"
                                className="w-full px-1 py-1.5 text-sm text-center bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                placeholder="کیلو"
                                value={item.kilo}
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                                  handleInvoiceItemChange(index, "kilo", rawValue);
                                }}
                              />
                              <input
                                type="text"
                                inputMode="decimal"
                                className="w-full px-1 py-1.5 text-sm text-center bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                placeholder="قیمت"
                                value={item.unitPrice}
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                                  const parts = rawValue.split(".");
                                  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                  handleInvoiceItemChange(index, "unitPrice", parts.join("."));
                                }}
                              />
                              <div className="flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-800">{formatNumber(lineTotal)}</span>
                              </div>
                              <div className="flex items-center justify-center">
                                {invoiceData.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInvoiceItem(index)}
                                    className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Side: Other Info */}
                    <div className="w-96 overflow-hidden space-y-2 px-3 py-2 min-h-0">
                      {/* Cards in 2x2 grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Current Account (after payment) */}
                        {(() => {
                          const prevBalance = parseFloat(invoiceCustomer?.accountBalance || 0);
                          const paid = parseFloat(String(invoiceData.paidAmount).replace(/,/g, "")) || 0;
                          const currentBalance = prevBalance - paid;
                          return (
                            <div className="bg-blue-50 rounded-lg px-3 py-2.5 border border-blue-200">
                              <span className="text-[10px] font-medium text-gray-600 block">موجودی حساب</span>
                              <span className={`text-sm font-bold ${currentBalance >= 0 ? "text-blue-700" : "text-red-600"}`}>
                                {formatNumber(currentBalance)}
                              </span>
                              <p className="text-[9px] text-gray-400 mt-0.5">
                                {currentBalance >= 0 ? "بستانکار" : "بدهکار"}
                              </p>
                            </div>
                          );
                        })()}

                        {/* Subtotal */}
                        <div className="bg-indigo-50 rounded-lg px-3 py-2.5 border border-indigo-100">
                          <span className="text-[10px] font-medium text-gray-600 block">جمع خالص</span>
                          <span className="text-sm font-bold text-indigo-700">{formatNumber(computeInvoiceSubtotal(invoiceData.items))}</span>
                        </div>

                        {/* Net Total */}
                        {(() => {
                          const discount = parseFloat(String(invoiceData.discount).replace(/,/g, "")) || 0;
                          const netTotal = computeInvoiceTotal(invoiceData.items, discount);
                          return (
                            <div className={`rounded-lg px-3 py-2.5 border ${discount > 0 ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"}`}>
                              <span className="text-[10px] font-medium text-gray-600 block">قابل پرداخت</span>
                              <span className="text-sm font-bold text-purple-700">{formatNumber(netTotal)}</span>
                              {discount > 0 && (
                                <p className="text-[9px] text-gray-400 mt-0.5">
                                  تخفیف: {formatNumber(discount)}
                                </p>
                              )}
                            </div>
                          );
                        })()}

                        {/* Remaining / Settled */}
                        {(() => {
                          const discount = parseFloat(String(invoiceData.discount).replace(/,/g, "")) || 0;
                          const netTotal = computeInvoiceTotal(invoiceData.items, discount);
                          const paid = parseFloat(String(invoiceData.paidAmount).replace(/,/g, "")) || 0;
                          const remaining = netTotal - paid;
                          return (
                            <div className={`rounded-lg px-3 py-2.5 border ${remaining <= 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
                              <span className="text-[10px] font-medium text-gray-600 block">{remaining <= 0 ? "وضعیت" : "باقی مانده"}</span>
                              <span className={`text-sm font-bold ${remaining <= 0 ? "text-green-700" : "text-orange-700"}`}>{remaining <= 0 ? "تسویه ✓" : formatNumber(remaining)}</span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Row 1: Invoice Number + Discount */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Invoice Number */}
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">
                            <Hash className="w-3 h-3 inline ml-1 text-gray-400" />
                            شماره فاکتور
                          </label>
                          <input
                            type="text"
                            dir="ltr"
                            className="w-full px-2 py-1.5 text-sm font-mono font-semibold text-center bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="INV-001"
                            value={invoiceData.invoiceNumber}
                            onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                          />
                        </div>

                        {/* Discount */}
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">تخفیف</label>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="w-full px-2 py-1.5 text-sm font-semibold text-center bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                            placeholder="0.00"
                            value={invoiceData.discount}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                              const parts = rawValue.split(".");
                              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                              setInvoiceData({ ...invoiceData, discount: parts.join(".") });
                            }}
                          />
                        </div>
                      </div>

                      {/* Row 2: Due Date + Paid Amount */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Due Date */}
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">تاریخ سررسید</label>
                          <ShamsiDatePicker
                            value={invoiceData.dueDate}
                            onChange={(date) => setInvoiceData({ ...invoiceData, dueDate: date })}
                          />
                        </div>

                        {/* Paid Amount */}
                        <div>
                          <label className="block text-[10px] font-medium text-gray-700 mb-1">
                            <CreditCard className="w-3 h-3 inline ml-1 text-gray-400" />
                            مبلغ پرداختی
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            className="w-full px-2 py-1.5 text-sm font-semibold text-center bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="0.00"
                            value={invoiceData.paidAmount}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/[^0-9.]/g, "");
                              const parts = rawValue.split(".");
                              parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                              setInvoiceData({ ...invoiceData, paidAmount: parts.join(".") });
                            }}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[10px] font-medium text-gray-700 mb-1">توضیحات (اختیاری)</label>
                        <textarea
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs resize-none"
                          placeholder="توضیحات فاکتور..."
                          value={invoiceData.description}
                          onChange={(e) => setInvoiceData({ ...invoiceData, description: e.target.value })}
                          rows={1}
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={(() => {
                          const discount = parseFloat(String(invoiceData.discount).replace(/,/g, "")) || 0;
                          return computeInvoiceTotal(invoiceData.items, discount) <= 0;
                        })()}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                        ثبت فاکتور
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </PopupScreen>
      )}
    </div>

      {/* Invoice print template — rendered at document.body via portal
          so it's a direct child of <body> and can flow naturally for
          multi-page printing without interference from popup positioning. */}
      {isInvoiceOpen && invoicePrintData && createPortal(
        <div className="print-invoice-wrapper" style={{ display: 'none' }}>
          <Invoice data={invoicePrintData} />
        </div>,
        document.body
      )}
    </>
  );
}
