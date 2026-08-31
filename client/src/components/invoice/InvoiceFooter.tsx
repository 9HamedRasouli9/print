interface InvoiceFooterProps {
  address: string;
  /** Current page number (1-based) */
  pageNumber?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Text color */
  textColor?: string;
}

export default function InvoiceFooter({ address, pageNumber, totalPages, textColor }: InvoiceFooterProps) {
  return (
    <div className="text-center mt-3 pt-2 text-[10px] leading-relaxed px-4" style={{ color: textColor }}>
      <p>آدرس: {address}</p>
      <p className="mt-1 font-medium">این فاکتور بدون مهر اعتبار ندارد</p>
      {pageNumber !== undefined && totalPages !== undefined && (
        <p className="mt-1 text-[9px]" style={{ color: textColor, opacity: 0.6 }}>
          صفحه {pageNumber} از {totalPages}
        </p>
      )}
    </div>
  );
}
