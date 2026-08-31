import InvoiceHeader from "./InvoiceHeader";
import InvoiceTable from "./InvoiceTable";
import InvoiceTotals from "./InvoiceTotals";
import InvoiceFooter from "./InvoiceFooter";
import type { InvoiceData, InvoiceItem } from "./types";

interface InvoiceProps {
  data: InvoiceData;
}

const MAX_ROWS_PER_PAGE = 25;

interface PageData {
  items: InvoiceItem[];
  showTotals: boolean;
}

/**
 * Build pages from the full item list.
 *
 * Rules:
 * - Maximum 25 rows per page.
 * - Full pages (exactly 25 items) do NOT show totals — they
 *   are pushed to the next page so the table has room.
 * - The LAST page ALWAYS shows totals, even if it's full.
 * - If the last page is full AND shows totals, the browser will
 *   naturally paginate the overflow.
 * - If there are no items, a single page with totals is returned.
 */
function buildPages(items: InvoiceItem[]): PageData[] {
  if (items.length === 0) return [{ items: [], showTotals: true }];

  const pages: PageData[] = [];
  let i = 0;

  while (i < items.length) {
    const remaining = items.length - i;
    const take = remaining > MAX_ROWS_PER_PAGE ? MAX_ROWS_PER_PAGE : remaining;
    const chunk = items.slice(i, i + take);
    const isFull = take === MAX_ROWS_PER_PAGE;
    const isLast = i + take >= items.length;

    pages.push({
      items: chunk,
      // Only the last page shows totals. Non-last full pages
      // skip totals so the table has the whole page.
      showTotals: isLast,
    });

    i += take;
  }

  return pages;
}

/**
 * Pixel-perfect printable Afghan / Persian accounting invoice.
 *
 * Designed exclusively for A4 portrait printing.
 * - Uses @media print and @page rules to lock the layout.
 * - No shadows, no rounded corners, classic accounting aesthetic.
 * - RTL layout with Persian/Dari text.
 * - Supports multiple pages: items are chunked into groups of 25;
 *   full pages (25 items) push totals to the next page.
 */
export default function Invoice({ data }: InvoiceProps) {
  // Compute derived values
  const total = data.items.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = total + data.previousDebt;
  const remaining = grandTotal - data.paid;

  // Build pages with the smart pagination logic
  const pages = buildPages(data.items);
  const pageCount = pages.length;

  return (
    <>
      {pages.map((page, pageIdx) => {
        const isLast = pageIdx === pageCount - 1;
        return (
          <div
            key={pageIdx}
            className="invoice-print-area"
            style={{
              width: "190mm",
              minHeight: "287mm",
              margin: "0 auto",
              backgroundColor: data.backgroundColor || "white",
              color: data.textColor || "#1f2937",
              fontFamily: "'Vazirmatn', 'Noto Nastaliq Urdu', 'Tahoma', sans-serif",
              lineHeight: "1.3",
              // Force a page break after every page except the last
              ...(!isLast ? { pageBreakAfter: "always" as const } : {}),
            }}
            dir="rtl"
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* ---- HEADER (shown on every page) ---- */}
              <InvoiceHeader
                companyName={data.companyName}
                companySubtitle={data.companySubtitle}
                entries={data.headerEntries}
                customer={data.customer}
                date={data.date}
                invoiceNumber={data.invoiceNumber}
                logo={data.logo}
                logoPosition={data.logoPosition}
                logoAlign={data.logoAlign}
                headerColor={data.headerColor}
                textColor={data.textColor}
              />

              {/* ---- MAIN TABLE ---- */}
              {page.items.length > 0 && (
                <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
                  <InvoiceTable items={page.items} totalRows={page.items.length} headerColor={data.headerColor} textColor={data.textColor} />
                </div>
              )}

              {/* ---- TOTALS (only on the last page) ---- */}
              {page.showTotals && (
                <div className="mt-auto" style={{ pageBreakInside: "avoid" }}>
                  <InvoiceTotals
                    total={total}
                    previousDebt={data.previousDebt}
                    grandTotal={grandTotal}
                    paid={data.paid}
                    remaining={remaining}
                    textColor={data.textColor}
                  />
                </div>
              )}

              {/* ---- FOOTER with page number (shown on every page) ---- */}
              <div className="px-4 pb-4">
                <InvoiceFooter address={data.address} pageNumber={pageIdx + 1} totalPages={pageCount} textColor={data.textColor} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
