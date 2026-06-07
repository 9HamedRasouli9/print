import { Link } from "react-router-dom";
import AppIcon from "../components/AppIcon";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <AppIcon size="sm" />
              <h1 className="text-2xl font-bold text-indigo-600">مشتری</h1>
            </div>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              ورود
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 max-md:py-10">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 max-md:text-3xl max-md:mb-4">
            به مشتری خوش آمدید
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto max-md:text-base max-md:mb-6 max-md:px-2">
            راه‌حلی ساده و زیبا برای تمام نیازهای چاپ شما. با ورود به حساب
            کاربری خود شروع کنید.
          </p>
          <div className="flex justify-center gap-4 max-md:flex-col max-md:px-4 max-md:gap-3">
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-medium text-lg shadow-lg hover:shadow-xl max-md:px-6 max-md:text-base"
            >
              شروع کنید
            </Link>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-lg shadow-lg hover:shadow-xl border border-indigo-200 max-md:px-6 max-md:text-base">
              بیشتر بدانید
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 max-md:gap-4 max-md:mt-10">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              آپلود آسان
            </h3>
            <p className="text-gray-600">
              اسناد خود را به سرعت و به آسانی با رابط کاربری شهودی ما آپلود
              کنید.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              چاپ سریع
            </h3>
            <p className="text-gray-600">
              اسناد خود را با سرویس چاپ پرسرعت ما به سرعت چاپ کنید.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">امن</h3>
            <p className="text-gray-600">
              اسناد شما با سیستم چاپ امن و خصوصی ما در امان هستند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
