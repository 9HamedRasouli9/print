import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OwnerRoutes from "./roles/OwnerRoutes";

export default function ProtectedRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "owner") return <OwnerRoutes />;
  return <Navigate to="/login" replace />;
}
