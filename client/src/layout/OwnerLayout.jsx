import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Users, LogOut } from "lucide-react";
import AppIcon from "../components/AppIcon";

const navItems = [
  { path: "/app/customer", icon: Users, label: "مشتریان" },
];

export default function OwnerLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-indigo-50 text-indigo-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

      {/* Sidebar */}
      <aside className="w-64 bg-white border-s border-gray-200 flex flex-col max-md:hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <AppIcon />
            <div>
              <h1 className="font-bold text-xl text-gray-900">مشتری</h1>
              <p className="text-xs text-gray-500">پنل مدیریت</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/app"}
              className={navLinkClass}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto max-md:pb-16 flex flex-col min-h-0">
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
