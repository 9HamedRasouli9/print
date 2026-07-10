import { X } from "lucide-react";

export default function PopupScreen({
  isShowing,
  setIsShowing,
  children,
  zIndex = 50,
}) {
  if (!isShowing) return null;
  return (
    <div
      className="fixed w-full h-screen min-w-32 flex items-center justify-center bg-white/70 inset-0 max-md:items-end max-md:bg-black/40 max-md:p-0"
      style={{ zIndex: zIndex === 1000 ? 9999 : zIndex }}
    >
      <div className="absolute bg-white p-4 rounded-xl shadow-2xl max-w-[calc(100vw-2rem)] max-md:relative max-md:w-full max-md:max-w-none max-md:max-h-[92vh] max-md:overflow-y-auto max-md:rounded-t-2xl max-md:rounded-b-none">
        <button
          onClick={() => setIsShowing(false)}
          className="absolute top-3 end-3 p-2 text-gray-600 hover:text-gray-900 bg-white/90 backdrop-blur-sm shadow-md border border-gray-200 hover:bg-gray-100 rounded-xl transition z-50 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
