import { useState, useRef, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  LogOut,
  LayoutDashboard,
  FileText,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppIcon from "../components/AppIcon";

const navItems = [
  { path: "/app", icon: LayoutDashboard, label: "داشبورد" },
  { path: "/app/customer", icon: Users, label: "مشتریان" },
  { path: "/app/invoices", icon: FileText, label: "فاکتورها" },
  { path: "/app/settings", icon: Settings, label: "تنظیمات" },
];

export default function OwnerLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isNavVisible, setIsNavVisible] = useState(false);
  const hideTimerRef = useRef(null);
  const navRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Clear any pending hide timer
  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  // Show navbar immediately
  const showNav = () => {
    clearHideTimer();
    setIsNavVisible(true);
  };

  // Hide navbar after a short delay when mouse leaves
  const startHideTimer = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => {
      setIsNavVisible(false);
    }, 300);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => clearHideTimer();
  }, []);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
      isActive
        ? "bg-indigo-50 text-indigo-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs font-medium transition ${
      isActive ? "text-indigo-600" : "text-gray-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex max-md:flex-col">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <AppIcon size="sm" />
          <div>
            <h1 className="font-bold text-lg text-gray-900">مشتری</h1>
            <p className="text-[10px] text-gray-500 leading-none">پنل مدیریت</p>
            {user && (
              <p className="text-[9px] text-gray-400 leading-none mt-0.5">
                {user.fullName}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          aria-label="خروج"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop navbar indicator & trigger */}
      <div
        onMouseEnter={showNav}
        className="fixed top-0 inset-x-0 z-40 h-4 max-md:hidden cursor-pointer"
      >
        {/* Visible pill indicator */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out ${
            isNavVisible
              ? "opacity-0 scale-50"
              : "opacity-100 scale-100"
          }`}
        >
          <div className="flex flex-col items-center gap-0.5 pt-1.5">
            <div className="w-10 h-1 bg-indigo-400/60 rounded-full" />
            <div className="w-6 h-0.5 bg-indigo-400/40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Auto-hiding top navbar */}
      <div
        ref={navRef}
        onMouseEnter={showNav}
        onMouseLeave={startHideTimer}
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-40 max-md:hidden transition-all duration-300 ease-in-out ${
          isNavVisible
            ? "translate-y-2 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/80 px-2 py-1.5 flex items-center gap-1 w-fit">
          {/* App logo/name on the left */}
          <div className="flex items-center gap-2 px-2 ml-1 border-l border-gray-200">
            <AppIcon size="sm" />
            <span className="text-sm font-bold text-gray-900">مشتری</span>
          </div>

          {/* Nav links */}
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/app"}
              className={navLinkClass}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}

          {/* User info & logout */}
          <div className="flex items-center gap-2 pr-2 mr-1 border-r border-gray-200">
            {user && (
              <span className="text-xs text-gray-400 hidden xl:block max-w-[100px] truncate">
                {user.fullName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition whitespace-nowrap"
              aria-label="خروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col min-h-0 max-md:pb-16">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/app"}
            className={mobileNavLinkClass}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
