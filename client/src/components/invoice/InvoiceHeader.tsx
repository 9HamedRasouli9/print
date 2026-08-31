import type { InvoiceData, HeaderEntry } from "./types";

interface InvoiceHeaderProps {
  companyName: string;
  companySubtitle?: string;
  entries: HeaderEntry[];
  customer: InvoiceData["customer"];
  date: InvoiceData["date"];
  invoiceNumber: InvoiceData["invoiceNumber"];
  logo?: string;
  /** Logo placement: "top" | "center" | "bottom" */
  logoPosition?: string;
  /** Logo horizontal alignment: "center" | "left" | "right" */
  logoAlign?: string;
  headerColor?: string;
  textColor?: string;
}

/** Convert a string of digits to Persian (Arabic-Indic) numerals */
const toPersianDigits = (str: string): string => {
  const persian: Record<string, string> = {
    "0": "۰",
    "1": "۱",
    "2": "۲",
    "3": "۳",
    "4": "۴",
    "5": "۵",
    "6": "۶",
    "7": "۷",
    "8": "۸",
    "9": "۹",
  };
  return str.replace(/[0-9]/g, (d) => persian[d] ?? d);
};

/** Render logo image at a given position and alignment in the header block */
const LogoBlock = ({ logo, position, align }: { logo: string; position: string; align?: string }) => {
  const marginBottom = position === "top" ? "0.75rem" : position === "center" ? "0.5rem" : "0";
  const marginTop = position === "bottom" ? "0.75rem" : position === "center" ? "0.5rem" : "0";
  // In RTL layout, justify-start = right, justify-end = left
  const justifyClass = align === "left" ? "justify-end" : align === "right" ? "justify-start" : "justify-center";
  return (
    <div className={`flex ${justifyClass}`} style={{ marginBottom, marginTop }}>
      <img
        src={logo}
        alt="لوگو"
        style={{ maxHeight: "60px", maxWidth: "120px", objectFit: "contain" }}
      />
    </div>
  );
};

/**
 * Render a single header entry in a grid cell.
 * - If label is empty, the value is shown centered (title/subtitle style).
 * - If label is present, it's shown above the value in smaller opaque text.
 */
const GridEntryBlock = ({
  entry,
  textColor,
}: {
  entry: HeaderEntry;
  textColor?: string;
}) => {
  const hasLabel = entry.label.trim().length > 0;

  if (!hasLabel) {
    return (
      <div className="w-full text-center" style={{ marginBottom: "2px" }}>
        <span className="text-xs" style={{ color: textColor, lineHeight: "1.3" }}>
          {entry.value}
        </span>
      </div>
    );
  }

  return (
    <div className="min-w-[100px] flex-1" style={{ flex: "1 1 0%" }}>
      <div
        className="text-[10px] font-medium leading-tight"
        style={{ color: textColor, opacity: 0.6 }}
      >
        {entry.label}
      </div>
      <div
        className="text-[12px] font-bold leading-snug whitespace-pre-wrap"
        style={{ color: textColor }}
      >
        {toPersianDigits(entry.value)}
      </div>
    </div>
  );
};

/**
 * Layout:
 * - companyName + companySubtitle → full-width centered header at the top
 * - entries → split into two columns below (first half on right, second half on left)
 */
const ContentLayout = ({
  entries,
  textColor,
}: {
  entries: HeaderEntry[];
  textColor?: string;
}) => {
  const mid = Math.ceil(entries.length / 2);
  const rightCol = entries.slice(0, mid);
  const leftCol = entries.slice(mid);

  if (entries.length === 0) return null;

  return (
    <div className="flex items-start justify-between gap-3">
      {/* Right column (visual right in RTL) — first half */}
      {rightCol.length > 0 && (
        <div className="flex flex-col gap-1.5 min-w-0" style={{ flex: "0 0 auto" }}>
          {rightCol.map((entry, idx) => (
            <GridEntryBlock key={`rt-${idx}`} entry={entry} textColor={textColor} />
          ))}
        </div>
      )}

      {/* Left column (visual left in RTL) — second half */}
      {leftCol.length > 0 && (
        <div className="flex flex-col gap-1.5 min-w-0" style={{ flex: "0 0 auto", textAlign: "left" }}>
          {leftCol.map((entry, idx) => (
            <GridEntryBlock key={`lt-${idx}`} entry={entry} textColor={textColor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function InvoiceHeader({
  companyName,
  companySubtitle,
  entries,
  customer,
  date,
  invoiceNumber,
  logo,
  logoPosition = "top",
  logoAlign = "center",
  headerColor = "#cddfb8",
  textColor,
}: InvoiceHeaderProps) {
  return (
    <>
      {/* Green header block */}
      <div
        className="border-2 border-black px-6 py-4"
        style={{ backgroundColor: headerColor }}
      >
        {/* Logo — top position */}
        {logo && (logoPosition === "top" || !logoPosition) && (
          <LogoBlock logo={logo} position="top" align={logoAlign} />
        )}

        {/* ── Company name + subtitle (fixed header) ── */}
        <div className="text-center">
          <span
            className="text-xl font-bold leading-tight"
            style={{ color: textColor }}
          >
            {companyName}
          </span>
          {companySubtitle && (
            <p className="text-xs leading-snug mt-1" style={{ color: textColor }}>
              {companySubtitle}
            </p>
          )}
        </div>

        {/* ── Entries (phones, info) split into two side columns ── */}
        <ContentLayout entries={entries} textColor={textColor} />

        {/* Logo — center position */}
        {logo && logoPosition === "center" && (
          <LogoBlock logo={logo} position="center" align={logoAlign} />
        )}

        {/* Logo — bottom position */}
        {logo && logoPosition === "bottom" && (
          <LogoBlock logo={logo} position="bottom" align={logoAlign} />
        )}
      </div>

      {/* Info row below header: date | customer | invoice number */}
      <div
        className="border-x-2 border-black px-4 py-2 flex items-center justify-between text-xs"
        style={{ borderBottom: "2px solid black", backgroundColor: "white", color: textColor }}
      >
        <span style={{ color: textColor }}>
          <span className="font-medium ml-1" style={{ color: textColor, opacity: 0.7 }}>تاریخ:</span>
          <span className="font-bold">{date}</span>
        </span>
        <span className="text-center flex-1 px-4" style={{ color: textColor }}>
          <span className="font-medium ml-1" style={{ opacity: 0.7 }}>مشتری:</span>
          <span className="font-bold">{customer}</span>
        </span>
        <span className="text-end" style={{ color: textColor }}>
          <span className="font-medium ml-1" style={{ opacity: 0.7 }}>شماره:</span>
          <span className="font-bold" dir="ltr">
            {invoiceNumber}
          </span>
        </span>
      </div>
    </>
  );
}
