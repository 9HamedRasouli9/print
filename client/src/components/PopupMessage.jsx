import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: {
    icon: "text-green-500",
    bg: "bg-green-50",
    button: "bg-green-600 hover:bg-green-700",
  },
  error: {
    icon: "text-red-500",
    bg: "bg-red-50",
    button: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: "text-yellow-500",
    bg: "bg-yellow-50",
    button: "bg-yellow-600 hover:bg-yellow-700",
  },
  info: {
    icon: "text-blue-500",
    bg: "bg-blue-50",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

export default function PopupMessage({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  primaryAction,
  primaryLabel = "تایید",
  secondaryAction,
  secondaryLabel = "لغو",
  showClose = true,
}) {
  if (!isOpen) return null;

  const Icon = icons[type] || icons.info;
  const color = colors[type] || colors.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className={`${color.bg} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${color.icon}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          {showClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="px-6 pb-6 flex gap-3 justify-end max-md:px-4 max-md:pb-4 max-md:flex-col-reverse max-md:gap-2">
          {secondaryAction && (
            <button
              onClick={secondaryAction}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer max-md:w-full max-md:py-2.5"
            >
              {secondaryLabel}
            </button>
          )}
          <button
            onClick={primaryAction || onClose}
            className={`px-4 py-2 rounded-lg text-white transition cursor-pointer ${color.button} max-md:w-full max-md:py-2.5`}
          >
            {primaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
