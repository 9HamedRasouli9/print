import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AlertCircle,
  Loader2,
  UserPlus,
  LogIn,
  Mail,
  Lock,
  User,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignUp) {
      if (!fullName.trim()) {
        setError("لطفاً نام و نام خانوادگی را وارد کنید");
        return;
      }
      if (!email || !password) {
        setError("لطفاً ایمیل و رمز عبور را وارد کنید");
        return;
      }
      if (password.length < 6) {
        setError("رمز عبور باید حداقل ۶ کاراکتر باشد");
        return;
      }
      if (password !== confirmPassword) {
        setError("رمز عبور و تکرار آن مطابقت ندارند");
        return;
      }
    } else {
      if (!email || !password) {
        setError("لطفاً ایمیل و رمز عبور را وارد کنید");
        return;
      }
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await register(fullName, email, password);
        navigate("/app");
      } else {
        await login(email, password);
        navigate("/app");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md max-md:p-6">
        {/* Logo / Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {isSignUp ? (
              <UserPlus className="w-8 h-8 text-indigo-600" />
            ) : (
              <LogIn className="w-8 h-8 text-indigo-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 max-md:text-xl">
            {isSignUp ? "ایجاد حساب کاربری" : "خوش آمدید"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isSignUp
              ? "برای ثبت‌نام اطلاعات خود را وارد کنید"
              : "وارد حساب کاربری خود شوید"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-700 animate-slideDown">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name (only in sign-up) */}
          {isSignUp && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام و نام خانوادگی
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="مثال: علی محمدی"
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="you@example.com"
                dir="ltr"
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رمز عبور
            </label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                placeholder="••••••••"
                dir="ltr"
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
          </div>

          {/* Confirm Password (only in sign-up) */}
          {isSignUp && (
            <div className="animate-fadeIn">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تکرار رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="••••••••"
                  dir="ltr"
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isSignUp ? "در حال ثبت‌نام..." : "در حال ورود..."}
              </>
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                ثبت‌نام
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                ورود
              </>
            )}
          </button>
        </form>

        {/* Toggle between sign-up and login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isSignUp ? "حساب کاربری دارید؟" : "حساب کاربری ندارید؟"}
            <button
              type="button"
              onClick={toggleMode}
              className="mr-1 text-indigo-600 hover:text-indigo-800 font-medium transition cursor-pointer"
            >
              {isSignUp ? "ورود" : "ثبت‌نام کنید"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
