import { useState, useEffect } from "react";
import { Save, User, Bell, Shield, Palette, FileText, Plus, Trash2, Image } from "lucide-react";
import useInvoiceSettings from "../hooks/useInvoiceSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { settings: invoiceSettings, updateSettings: updateInvoiceSettings } =
    useInvoiceSettings();

  const [formData, setFormData] = useState({
    firstName: "مدیر",
    lastName: "سیستم",
    email: "owner@printhub.com",
    phone: "+93 700 000 000",
    company: "مشتری",

    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    paymentAlerts: true,
    systemUpdates: false,

    twoFactor: false,
    sessionTimeout: 30,

    theme: "light",
    language: "fa",
    timezone: "UTC+4:30",
  });

  // Local state for the invoice settings form (editable copy)
  const [invoiceForm, setInvoiceForm] = useState({ ...invoiceSettings });

  // Keep the form in sync when settings are loaded/reset
  useEffect(() => {
    setInvoiceForm({ ...invoiceSettings });
  }, [invoiceSettings]);

  const tabs = [
    { id: "profile", label: "پروفایل", icon: User },
    { id: "notifications", label: "اعلان‌ها", icon: Bell },
    { id: "security", label: "امنیت", icon: Shield },
    { id: "appearance", label: "ظاهر", icon: Palette },
    { id: "invoice", label: "فاکتور", icon: FileText },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInvoiceInputChange = (field, value) => {
    setInvoiceForm((prev) => ({ ...prev, [field]: value }));
  };

  /** Add a new header entry (defaults to full width) */
  const handleAddEntry = () => {
    setInvoiceForm((prev) => ({
      ...prev,
      headerEntries: [
        ...prev.headerEntries,
        { label: "", value: "" },
      ],
    }));
  };

  /** Update a header entry at the given index */
  const handleEntryChange = (index, field, value) => {
    setInvoiceForm((prev) => {
      const entries = prev.headerEntries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      );
      return { ...prev, headerEntries: entries };
    });
  };

  /** Remove a header entry at the given index */
  const handleRemoveEntry = (index) => {
    setInvoiceForm((prev) => {
      const entries = prev.headerEntries.filter((_, i) => i !== index);
      return { ...prev, headerEntries: entries };
    });
  };

  // No drag-and-drop or resize — entries have fixed positions

  /** Upload a logo image — converts to base64 data URL */
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Max size: 500 KB
    if (file.size > 500 * 1024) {
      alert("حجم فایل نباید بیشتر از ۵۰۰ کیلوبایت باشد");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        setInvoiceForm((prev) => ({ ...prev, logo: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
    // Reset the input so the same file can be re-selected
    e.target.value = "";
  };

  /** Remove the logo */
  const handleLogoRemove = () => {
    setInvoiceForm((prev) => ({ ...prev, logo: "" }));
  };

  const handleSave = () => {
    console.log("Settings saved:", formData);
    updateInvoiceSettings(invoiceForm);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نام خانوادگی
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تلفن
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شرکت
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                کانال‌های اعلان
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ms-2 text-sm text-gray-700">
                    اعلان ایمیل
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ms-2 text-sm text-gray-700">
                    اعلان پوش
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={formData.smsNotifications}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ms-2 text-sm text-gray-700">
                    اعلان پیامکی
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                انواع اعلان
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="orderUpdates"
                    checked={formData.orderUpdates}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ms-2 text-sm text-gray-700">
                    به‌روزرسانی سفارشات
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="paymentAlerts"
                    checked={formData.paymentAlerts}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ms-2 text-sm text-gray-700">
                    هشدار پرداخت
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="systemUpdates"
                    checked={formData.systemUpdates}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ms-2 text-sm text-gray-700">
                    به‌روزرسانی سیستم
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                احراز هویت
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="twoFactor"
                    checked={formData.twoFactor}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ms-2 text-sm text-gray-700">
                    احراز هویت دو مرحله‌ای
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                مدیریت نشست
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدت زمان نشست (دقیقه)
                </label>
                <select
                  name="sessionTimeout"
                  value={formData.sessionTimeout}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={15}>۱۵ دقیقه</option>
                  <option value={30}>۳۰ دقیقه</option>
                  <option value={60}>۱ ساعت</option>
                  <option value={120}>۲ ساعت</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">رمز عبور</h3>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                تغییر رمز عبور
              </button>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">تم</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تم
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="light">روشن</option>
                  <option value="dark">تاریک</option>
                  <option value="system">سیستم</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">منطقه‌ای</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    زبان
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="fa">فارسی</option>
                    <option value="en">انگلیسی</option>
                    <option value="ps">پشتو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    منطقه زمانی
                  </label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="UTC+4:30">افغانستان (UTC+4:30)</option>
                    <option value="UTC+3:30">ایران (UTC+3:30)</option>
                    <option value="UTC+0">گرینویچ (UTC+0)</option>
                    <option value="UTC+1">اروپای مرکزی (UTC+1)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "invoice":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ویرایش سربرگ فاکتور
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                مستقیماً روی مقادیر یا برچسب‌های داخل پیش‌نمایش کلیک کنید تا آن‌ها را ویرایش کنید.
              </p>

              {/* ── Live Preview + Inline Editor ── */}
              <div
                className="border-2 border-black rounded-lg overflow-hidden mb-6 shadow-sm"
                style={{
                  backgroundColor: invoiceForm.backgroundColor || "#ffffff",
                  color: invoiceForm.textColor || "#1f2937",
                }}
              >
                {/* ── Header block (editable) ── */}
                <div
                  className="px-5 py-4 border-b-2 border-black"
                  style={{ backgroundColor: invoiceForm.headerColor || "#cddfb8" }}
                >
                  {/* Logo — top position */}
                  {invoiceForm.logo && (invoiceForm.logoPosition === "top" || !invoiceForm.logoPosition) && (
                    <div className={`flex ${
                      invoiceForm.logoAlign === "left" ? "justify-end" :
                      invoiceForm.logoAlign === "right" ? "justify-start" :
                      "justify-center"
                    } mb-3`}>
                      <img
                        src={invoiceForm.logo}
                        alt="لوگو"
                        style={{ maxHeight: "48px", maxWidth: "100px", objectFit: "contain" }}
                      />
                    </div>
                  )}

                  {/* ── HEADER: company name + subtitle (fixed, not deletable) ── */}
                  <div className="text-center">
                    <input
                      type="text"
                      value={invoiceForm.companyName || ""}
                      onChange={(e) => handleInvoiceInputChange("companyName", e.target.value)}
                      className="w-full bg-transparent text-center text-xl font-bold leading-tight outline-none p-0 m-0 focus-visible:ring-1 focus-visible:ring-indigo-400/40 rounded-sm"
                      style={{ color: invoiceForm.textColor || "#1f2937" }}
                      placeholder="نام شرکت..."
                    />
                    <input
                      type="text"
                      value={invoiceForm.companySubtitle || ""}
                      onChange={(e) => handleInvoiceInputChange("companySubtitle", e.target.value)}
                      className="w-full bg-transparent text-center text-xs leading-snug outline-none p-0 m-0 mt-1 focus-visible:ring-1 focus-visible:ring-indigo-400/40 rounded-sm"
                      style={{ color: invoiceForm.textColor || "#1f2937" }}
                      placeholder="زیر عنوان..."
                    />
                  </div>

                  {/* ── Entries (phones, info) split into two side columns ── */}
                  {(() => {
                    const entries = invoiceForm.headerEntries || [];
                    const tc = invoiceForm.textColor || "#1f2937";
                    const mid = Math.ceil(entries.length / 2);
                    const rightCol = entries.slice(0, mid);
                    const leftCol = entries.slice(mid);

                    if (entries.length === 0) return null;

                    return (
                      <div className="flex items-start justify-between gap-3 mt-3">
                        {/* Right column (visual right in RTL) — first half */}
                        <div className="flex flex-col gap-1.5 min-w-0" style={{ flex: "0 0 auto" }}>
                          {rightCol.map((entry) => {
                            const realIdx = entries.indexOf(entry);
                            return (
                              <div key={`rt-${realIdx}`} className="min-w-[80px] relative group/entry">
                                <input type="text" value={entry.label}
                                  onChange={(e) => handleEntryChange(realIdx, "label", e.target.value)}
                                  className="block w-full text-[10px] font-medium leading-tight bg-transparent outline-none p-0 m-0 focus-visible:ring-1 focus-visible:ring-indigo-400/40 rounded-sm"
                                  style={{ color: tc, opacity: 0.6 }} placeholder="برچسب" />
                                <input type="text" value={entry.value}
                                  onChange={(e) => handleEntryChange(realIdx, "value", e.target.value)}
                                  className="block w-full text-[12px] font-bold leading-snug bg-transparent outline-none p-0 m-0 focus-visible:ring-1 focus-visible:ring-indigo-400/40 rounded-sm"
                                  style={{ color: tc }} placeholder="مقدار..." />
                                {entries.length > 1 && (
                                  <button type="button" onClick={() => handleRemoveEntry(realIdx)}
                                    className="absolute -top-1.5 right-0 p-0.5 text-red-400 opacity-0 group-hover/entry:opacity-100 hover:text-red-600 transition cursor-pointer">
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Left column (visual left in RTL) — second half */}
                        <div className="flex flex-col gap-1.5 min-w-0" style={{ flex: "0 0 auto", textAlign: "left" }}>
                          {leftCol.map((entry) => {
                            const realIdx = entries.indexOf(entry);
                            return (
                              <div key={`lt-${realIdx}`} className="min-w-[80px] relative group/entry" style={{ textAlign: "left" }}>
                                <input type="text" value={entry.label}
                                  onChange={(e) => handleEntryChange(realIdx, "label", e.target.value)}
                                  className="block w-full text-[10px] font-medium leading-tight bg-transparent outline-none p-0 m-0 focus-visible:ring-1 focus-visible:ring-indigo-400/40 rounded-sm"
                                  style={{ color: tc, opacity: 0.6 }} placeholder="برچسب" />
                                <input type="text" value={entry.value}
                                  onChange={(e) => handleEntryChange(realIdx, "value", e.target.value)}
                                  className="block w-full text-[12px] font-bold leading-snug bg-transparent outline-none p-0 m-0 focus-visible:ring-1 focus-visible:ring-indigo-400/40 rounded-sm"
                                  style={{ color: tc }} placeholder="مقدار..." />
                                {entries.length > 1 && (
                                  <button type="button" onClick={() => handleRemoveEntry(realIdx)}
                                    className="absolute -top-1.5 right-0 p-0.5 text-red-400 opacity-0 group-hover/entry:opacity-100 hover:text-red-600 transition cursor-pointer">
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                  {/* ── Add entry ── */}
                  <div className="flex justify-start pt-1">
                    <button
                      type="button"
                      onClick={handleAddEntry}
                      className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-gray-400 hover:text-indigo-500 transition cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      افزودن
                    </button>
                  </div>

                  {/* Logo — bottom position */}
                  {invoiceForm.logo && invoiceForm.logoPosition === "bottom" && (
                    <div className={`flex ${
                      invoiceForm.logoAlign === "left" ? "justify-end" :
                      invoiceForm.logoAlign === "right" ? "justify-start" :
                      "justify-center"
                    } mt-3`}>
                      <img
                        src={invoiceForm.logo}
                        alt="لوگو"
                        style={{ maxHeight: "48px", maxWidth: "100px", objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div>

                {/* ── Info row (static preview) ── */}
                <div
                  className="border-b-2 border-black px-4 py-2 flex items-center justify-between text-xs"
                  style={{
                    backgroundColor: "white",
                    color: invoiceForm.textColor || "#1f2937",
                  }}
                >
                  <span style={{ opacity: 0.7 }}>
                    <span className="ml-1" style={{ opacity: 0.5 }}>تاریخ:</span>
                    <span className="font-bold">۱۴۰۳/۰۴/۲۲</span>
                  </span>
                  <span className="text-center flex-1 px-4" style={{ opacity: 0.7 }}>
                    <span className="ml-1" style={{ opacity: 0.5 }}>مشتری:</span>
                    <span className="font-bold">مشتری نمونه</span>
                  </span>
                  <span style={{ opacity: 0.7 }}>
                    <span className="ml-1" style={{ opacity: 0.5 }}>شماره:</span>
                    <span className="font-bold">______</span>
                  </span>
                </div>

                {/* ── Table header preview ── */}
                <div
                  className="flex text-[10px] font-bold"
                  style={{
                    backgroundColor: invoiceForm.headerColor || "#cddfb8",
                    color: invoiceForm.textColor || "#1f2937",
                  }}
                >
                  {["#", "شرح", "تعداد", "کیلو", "فی", "مبلغ"].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center py-1.5 border-l border-black last:border-l-0"
                    >
                      {h}
                    </div>
                  ))}
                </div>

                {/* ── Sample row ── */}
                <div
                  className="flex text-[10px] border-b border-black"
                  style={{ color: invoiceForm.textColor || "#1f2937" }}
                >
                  {["۱", "قلم نمونه", "۵", "-", "۱۰٬۰۰۰", "۵۰٬۰۰۰"].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 text-center py-2 border-l border-black last:border-l-0"
                      style={{ opacity: 0.5 }}
                    >
                      {v}
                    </div>
                  ))}
                </div>

                {/* ── Totals preview ── */}
                <div className="px-3 py-1.5 text-[10px]" style={{ color: invoiceForm.textColor || "#1f2937" }}>
                  <div className="flex justify-between py-0.5">
                    <span style={{ opacity: 0.7 }}>مجموع</span>
                    <span className="font-bold">۵۰٬۰۰۰</span>
                  </div>
                  <div className="flex justify-between py-0.5 font-bold border-t border-black">
                    <span>بدهی قبلی</span>
                    <span>۱۰٬۰۰۰</span>
                  </div>
                  <div className="flex justify-between py-0.5 font-bold">
                    <span>مجموع کل</span>
                    <span>۶۰٬۰۰۰</span>
                  </div>
                </div>

                {/* ── Footer preview ── */}
                <div className="text-center text-[9px] py-1.5 px-3 border-t border-black" style={{ opacity: 0.6 }}>
                  آدرس: {invoiceForm.address || "آدرس خود را وارد کنید..."}
                </div>
              </div>

              {/* ── Logo ── */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  لوگوی شرکت
                </label>
                <div className="flex items-start gap-4">
                  {/* Upload button or current logo */}
                  {invoiceForm.logo ? (
                    <div className="relative group">
                      <img
                        src={invoiceForm.logo}
                        alt="لوگو"
                        className="h-16 w-auto rounded-lg border border-gray-200 object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                        {/* Replace */}
                        <label className="p-1 text-white hover:text-indigo-200 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                          <Image className="w-4 h-4" />
                        </label>
                        {/* Remove */}
                        <button
                          type="button"
                          onClick={handleLogoRemove}
                          className="p-1 text-white hover:text-red-300 cursor-pointer"
                          title="حذف لوگو"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-indigo-600 hover:border-indigo-400 transition cursor-pointer">
                      <Image className="w-5 h-5" />
                      بارگذاری لوگو
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  )}
                  {/* Position selector — only when logo exists */}
                  {invoiceForm.logo && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-500">عمودی:</label>
                      <select
                        value={invoiceForm.logoPosition || "top"}
                        onChange={(e) =>
                          handleInvoiceInputChange("logoPosition", e.target.value)
                        }
                        className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="top">بالا</option>
                        <option value="center">وسط</option>
                        <option value="bottom">پایین</option>
                      </select>
                      <label className="text-xs text-gray-500 mr-2">ستون:</label>
                      <select
                        value={invoiceForm.logoAlign || "center"}
                        onChange={(e) =>
                          handleInvoiceInputChange("logoAlign", e.target.value)
                        }
                        className="px-2 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="center">وسط</option>
                        <option value="left">چپ</option>
                        <option value="right">راست</option>
                      </select>
                    </div>
                  )}
                </div>
                {invoiceForm.logo && (
                  <p className="text-xs text-gray-400 mt-1">
                    نشانگر ماوس را روی لوگو ببرید تا تعویض یا حذف کنید
                  </p>
                )}
              </div>

              {/* ── Address ── */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  آدرس (پاورقی فاکتور)
                </label>
                <textarea
                  value={invoiceForm.address}
                  onChange={(e) =>
                    handleInvoiceInputChange("address", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={2}
                  placeholder="آدرس شرکت خود را وارد کنید"
                />
              </div>

              {/* ── Color Settings ── */}
              <div className="border-t border-gray-200 pt-5 space-y-4">
                <h4 className="text-sm font-medium text-gray-900">
                  رنگ‌بندی فاکتور
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Header Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رنگ سربرگ
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={invoiceForm.headerColor || "#cddfb8"}
                        onChange={(e) =>
                          handleInvoiceInputChange("headerColor", e.target.value)
                        }
                        className="w-10 h-9 p-0.5 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={invoiceForm.headerColor || "#cddfb8"}
                        onChange={(e) =>
                          handleInvoiceInputChange("headerColor", e.target.value)
                        }
                        className="w-28 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs text-start"
                        dir="ltr"
                        placeholder="#cddfb8"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رنگ پس‌زمینه
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={invoiceForm.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          handleInvoiceInputChange("backgroundColor", e.target.value)
                        }
                        className="w-10 h-9 p-0.5 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={invoiceForm.backgroundColor || "#ffffff"}
                        onChange={(e) =>
                          handleInvoiceInputChange("backgroundColor", e.target.value)
                        }
                        className="w-28 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs text-start"
                        dir="ltr"
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رنگ متن
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={invoiceForm.textColor || "#1f2937"}
                        onChange={(e) =>
                          handleInvoiceInputChange("textColor", e.target.value)
                        }
                        className="w-10 h-9 p-0.5 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={invoiceForm.textColor || "#1f2937"}
                        onChange={(e) =>
                          handleInvoiceInputChange("textColor", e.target.value)
                        }
                        className="w-28 px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs text-start"
                        dir="ltr"
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  تغییر رنگ‌ها بلافاصله در پیش‌نمایش بالا اعمال می‌شود
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">تنظیمات</h1>
        <p className="text-gray-600 mt-2">
          مدیریت تنظیمات حساب کاربری و ترجیحات
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Save className="w-4 h-4" />
              ذخیره تغییرات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
