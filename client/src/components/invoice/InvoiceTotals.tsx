interface InvoiceTotalsProps {
  /** Sum of all line item amounts */
  total: number;
  /** Customer's previous debt balance */
  previousDebt: number;
  /** Grand total (total + previousDebt) — computed if not provided */
  grandTotal?: number;
  /** Amount paid in this transaction */
  paid: number;
  /** Remaining balance (grandTotal - paid) — computed if not provided */
  remaining?: number;
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

interface TotalRowProps {
  label: string;
  value: number;
  isBold?: boolean;
  isNegative?: boolean;
  isLarge?: boolean;
  showBorder?: boolean;
  textColor?: string;
}

function TotalRow({
  label,
  value,
  isBold = false,
  isNegative = false,
  isLarge = false,
  showBorder = true,
  textColor = "#1f2937",
}: TotalRowProps & { textColor?: string }) {
  return (
    <div
      className={`flex items-center justify-between px-4 ${
        isLarge ? "py-2" : "py-[5px]"
      } ${showBorder ? "border-b border-black" : ""} ${
        isBold ? "font-bold" : ""
      }`}
    >
      <span
        className={`${isLarge ? "text-sm" : "text-[12px]"} ${
          isBold ? "font-bold" : ""
        }`}
        style={{ color: isBold ? textColor : undefined, opacity: isBold ? 1 : 0.7 }}
      >
        {label}
      </span>
      <span
        className={`${isLarge ? "text-sm" : "text-[12px]"} ${isBold ? "font-bold" : ""}`}
        style={{
          direction: "ltr",
          textAlign: "right",
          color: isNegative ? "#dc2626" : textColor,
          fontWeight: isNegative ? 700 : isBold ? 700 : undefined,
        }}
      >
        {formatNum(value)}
      </span>
    </div>
  );
}

export default function InvoiceTotals({
  total,
  previousDebt,
  grandTotal: grandTotalProp,
  paid,
  remaining: remainingProp,
  textColor,
}: InvoiceTotalsProps) {
  const grandTotal = grandTotalProp ?? total + previousDebt;
  const remaining = remainingProp ?? grandTotal - paid;

  return (
    <div className="border-2 border-black border-t-0">
      {/* Total */}
      <TotalRow label="مجموع" value={total} textColor={textColor} />

      {/* Previous Debt */}
      <TotalRow
        label="بدهی قبلی"
        value={previousDebt}
        isNegative={previousDebt > 0}
        textColor={textColor}
      />

      {/* Grand Total */}
      <TotalRow label="مجموع کل" value={grandTotal} isBold showBorder={paid > 0} textColor={textColor} />

      {/* Paid */}
      {paid > 0 && (
        <TotalRow
          label="پرداخت"
          value={paid}
          isNegative={false}
          textColor={textColor}
        />
      )}

      {/* Remaining */}
      <TotalRow
        label={remaining <= 0 ? "تسویه" : "باقی مانده"}
        value={remaining <= 0 ? 0 : remaining}
        isBold
        isLarge
        showBorder={false}
        isNegative={remaining > 0}
        textColor={textColor}
      />
    </div>
  );
}
