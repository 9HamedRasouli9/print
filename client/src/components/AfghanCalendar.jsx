import { useState } from "react";
import moment from "jalali-moment";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatAfghanMonthYear } from "../utils/shamsiDate";

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function parseShamsi(value) {
  if (!value) return null;
  const m = moment.from(value, "fa", "jYYYY/jMM/jDD");
  return m.isValid() ? m.locale("fa") : null;
}

export default function AfghanCalendar({ onSelect, value }) {
  const [viewDate, setViewDate] = useState(() => parseShamsi(value) || moment().locale("fa"));

  const startOfMonth = viewDate.clone().startOf("jMonth");
  const daysInMonth = viewDate.jDaysInMonth();
  const startDayIndex = startOfMonth.day();
  const selected = parseShamsi(value);
  const today = moment().locale("fa");

  const days = [];

  for (let i = 0; i < startDayIndex; i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const goToMonth = (offset) => {
    setViewDate((current) => current.clone().add(offset, "jMonth"));
  };

  return (
    <div className="bg-white border border-gray-200 p-2.5 rounded-lg w-[240px]">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <h2 className="text-xs font-semibold text-gray-900 truncate px-1">
          {formatAfghanMonthYear(viewDate)}
        </h2>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
        {weekDays.map((day) => (
          <div key={day} className="text-gray-500 text-[10px] leading-4">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} />;
          }

          const dayMoment = viewDate.clone().jDate(day);
          const isSelected =
            selected &&
            selected.jYear() === dayMoment.jYear() &&
            selected.jMonth() === dayMoment.jMonth() &&
            selected.jDate() === day;
          const isToday =
            today.jYear() === dayMoment.jYear() &&
            today.jMonth() === dayMoment.jMonth() &&
            today.jDate() === day;

          return (
            <button
              key={index}
              type="button"
              onClick={() =>
                onSelect(dayMoment.format("jYYYY/jMM/jDD"))
              }
              className={`py-1 rounded text-xs transition ${
                isSelected
                  ? "bg-indigo-600 text-white"
                  : isToday
                    ? "bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
