import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "lucide-react";
import AfghanCalendar from "./AfghanCalendar";

const CALENDAR_WIDTH = 240;
const CALENDAR_HEIGHT = 260;
const VIEWPORT_PADDING = 8;

export default function ShamsiDatePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef(null);
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const inWrapper = wrapperRef.current?.contains(event.target);
      const inCalendar = calendarRef.current?.contains(event.target);
      if (!inWrapper && !inCalendar) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
      const spaceAbove = rect.top - VIEWPORT_PADDING;
      const openUp =
        spaceBelow < CALENDAR_HEIGHT && spaceAbove > spaceBelow;

      let top = openUp
        ? rect.top - CALENDAR_HEIGHT - 4
        : rect.bottom + 4;
      let left = rect.left;

      if (left + CALENDAR_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
        left = window.innerWidth - CALENDAR_WIDTH - VIEWPORT_PADDING;
      }
      if (left < VIEWPORT_PADDING) {
        left = VIEWPORT_PADDING;
      }

      top = Math.max(
        VIEWPORT_PADDING,
        Math.min(top, window.innerHeight - CALENDAR_HEIGHT - VIEWPORT_PADDING),
      );

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const handleSelect = (date) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <>
      <div ref={wrapperRef} className="relative">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={
            compact
              ? "flex items-center gap-1.5 px-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition max-w-[130px]"
              : "w-full flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
          }
        >
          <Calendar className={compact ? "w-3 h-3 shrink-0" : "w-4 h-4 shrink-0"} />
          <span className="truncate">{value || placeholder}</span>
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={calendarRef}
            className="fixed z-[10000] shadow-xl rounded-lg"
            style={{ top: position.top, left: position.left }}
          >
            <AfghanCalendar value={value} onSelect={handleSelect} />
          </div>,
          document.body,
        )}
    </>
  );
}
