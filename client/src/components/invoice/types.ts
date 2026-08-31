export interface InvoiceItem {
  description: string;
  /** Piece count (تعداد) — used when unit is not "کیلو" */
  count: number;
  /** Kilo weight (کیلو) — used when unit is "کیلو" */
  kilo: number;
  /** Unit label (واحد) e.g. "کیلو", "عدد", "متر" */
  unit: string;
  /** Unit price */
  price: number;
  /** Line total (computed: kilo*price or count*price) */
  amount: number;
}

/** A single dynamic entry displayed in the invoice header */
export interface HeaderEntry {
  /** Short label shown in smaller text (e.g. "شرکت", "تلفن", "آدرس").
   *  If empty, the entry is rendered as centered text (title/subtitle style). */
  label: string;
  /** The actual content / value text */
  value: string;
  /** @deprecated kept for backward compatibility */
  width?: number;
  /** @deprecated kept for backward compatibility */
  col?: number;
}

export interface InvoiceData {
  /** Company name displayed as the main header */
  companyName: string;
  /** Company subtitle displayed under the company name */
  companySubtitle?: string;
  /** Dynamic label/value entries displayed in the invoice header */
  headerEntries: HeaderEntry[];
  /** Customer / buyer full name */
  customer: string;
  /** Invoice date in Shamsi / Persian format (e.g. ۱۴۰۳/۰۴/۲۲) */
  date: string;
  /** Invoice number */
  invoiceNumber: string;
  /** Customer's previous debt balance */
  previousDebt: number;
  /** Amount paid in this transaction */
  paid: number;
  /** Line items */
  items: InvoiceItem[];
  /** Company / shop address printed in footer */
  address: string;
  /** Optional company logo (base64 data URL) displayed in the header */
  logo?: string;
  /** Logo placement: "top" (above title), "center" (between title & entries), "bottom" (below entries) */
  logoPosition?: string;
  /** Logo horizontal alignment: "center", "left", "right" */
  logoAlign?: string;
  /** Background color of the header and table header (e.g. "#cddfb8") */
  headerColor?: string;
  /** Page background color */
  backgroundColor?: string;
  /** Text color for the entire invoice */
  textColor?: string;
}
