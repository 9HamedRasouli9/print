import type { InvoiceItem } from "./types";

interface InvoiceTableProps {
  items: InvoiceItem[];
  /** Total number of rows to render (data + empty placeholders). Default 20. */
  totalRows?: number;
  /** Background color of the column headers row */
  headerColor?: string;
  /** Text color */
  textColor?: string;
}

/** Format a number to Persian locale with 2 decimal places */
const formatNum = (n: number): string => {
  if (isNaN(n)) return "۰.۰۰";
  return n.toLocaleString("fa-IR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const COL_HEADERS = ["شماره", "تشریحات", "تعداد", "کیلو", "فی", "مبلغ"] as const;

/** Column widths: row# (40px), desc (1fr), count (50px), kilo (50px), price (55px), amount (60px) */
const COL_CLASSES =
  "grid-cols-[40px_1fr_50px_50px_55px_60px]";

export default function InvoiceTable({
  items,
  totalRows = 20,
  headerColor = "#cddfb8",
  textColor,
}: InvoiceTableProps) {
  // Build rows: first the data items, then empty placeholders
  const rows: (InvoiceItem & { isPlaceholder: boolean })[] = [
    ...items.map((item) => ({ ...item, isPlaceholder: false })),
  ];

  while (rows.length < totalRows) {
    rows.push({
      description: "",
      count: 0,
      kilo: 0,
      unit: "",
      price: 0,
      amount: 0,
      isPlaceholder: true,
    });
  }

  return (
    <div className="border-2 border-black border-t-0">
      {/* Column headers */}
      <div
        className={`grid ${COL_CLASSES} border-b border-black text-center`}
        style={{
          backgroundColor: headerColor,
        }}
      >
        {COL_HEADERS.map((header) => (
          <div
            key={header}
            className={`py-[6px] text-[11px] font-bold border-l border-black last:border-l-0 ${
              header === "تشریحات" ? "text-start pr-3" : ""
            }`}
            style={{ color: textColor }}
          >
            {header}
          </div>
        ))}
      </div>

      {/* Data / placeholder rows */}
      {rows.map((row, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <div
            key={idx}
            className={`grid ${COL_CLASSES} text-center border-b border-black last:border-b-0 ${
              isEven ? "bg-white" : "bg-gray-50"
            }`}
            style={{ height: "32px" }}
          >
            {/* Row number */}
            <div className="flex items-center justify-center border-l border-black text-[11px] font-mono" style={{ color: textColor }}>
              {idx + 1}
            </div>

            {/* Description */}
            <div className="flex items-center border-l border-black text-[11px] text-start px-2 leading-tight overflow-hidden" style={{ color: textColor }}>
              {row.description || "\u00A0"}
            </div>

            {/* Count (تعداد) */}
            <div className="flex items-center justify-center border-l border-black text-[11px]" style={{ color: textColor }}>
              {row.count > 0 && !row.isPlaceholder
                ? row.count.toLocaleString("fa-IR")
                : "\u00A0"}
            </div>

            {/* Kilo (کیلو) */}
            <div className="flex items-center justify-center border-l border-black text-[11px]" style={{ color: textColor }}>
              {row.kilo > 0 && !row.isPlaceholder
                ? row.kilo.toLocaleString("fa-IR")
                : "\u00A0"}
            </div>

            {/* Price (فی) — unit price */}
            <div className="flex items-center justify-end border-l border-black text-[11px] px-1.5" style={{ color: textColor }}>
              {row.price > 0 && !row.isPlaceholder
                ? formatNum(row.price)
                : "\u00A0"}
            </div>

            {/* Amount (مبلغ) — line total */}
            <div className="flex items-center justify-end text-[11px] font-semibold px-1.5" style={{ color: textColor }}>
              {row.amount > 0 && !row.isPlaceholder
                ? formatNum(row.amount)
                : "\u00A0"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
