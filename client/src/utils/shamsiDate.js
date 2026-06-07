import moment from "jalali-moment";

const SHAMSI_FORMAT = "jYYYY/jMM/jDD";

export const AFGHAN_MONTHS = [
  "حمل",
  "ثور",
  "جوزا",
  "سرطان",
  "اسد",
  "سنبله",
  "میزان",
  "عقرب",
  "قوس",
  "جدی",
  "دلو",
  "حوت",
];

export function formatAfghanMonthYear(dateInput) {
  const m = moment(dateInput).locale("fa");
  if (!m.isValid()) return "";
  return `${AFGHAN_MONTHS[m.jMonth()]} ${m.jYear()}`;
}

export function todayShamsi() {
  return moment().locale("fa").format(SHAMSI_FORMAT);
}

export function toShamsi(dateInput) {
  if (!dateInput) return "";
  const m = moment(dateInput);
  return m.isValid() ? m.locale("fa").format(SHAMSI_FORMAT) : "";
}

export function shamsiToGregorian(shamsiStr) {
  if (!shamsiStr) return "";
  const m = moment.from(shamsiStr, "fa", SHAMSI_FORMAT);
  return m.isValid() ? m.format("YYYY-MM-DD") : "";
}

export function shamsiToDate(shamsiStr) {
  if (!shamsiStr) return null;
  const m = moment.from(shamsiStr, "fa", SHAMSI_FORMAT);
  return m.isValid() ? m.toDate() : null;
}
