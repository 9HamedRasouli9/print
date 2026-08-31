import { useState, useCallback } from "react";

const STORAGE_KEY = "invoice_settings";

const defaultSettings = {
  /** Company name — shown as the main header at the top of the invoice */
  companyName: "شرکت تجارتی محسن رسولی",
  /** Company subtitle — shown under the company name */
  companySubtitle: "وارد کننده انواع مواد خام شوید",
  /** Dynamic list of label/value pairs shown in the invoice header below the company name */
  headerEntries: [
    { label: "تلفن", value: "۰۲۱-۳۶۰۰-۰۰۱" },
    { label: "تلفن", value: "۰۲۱-۳۶۰۰-۰۰۲" },
    { label: "آدرس", value: "هرات، جاده بهزاد، مارکیت فلان، طبقه دوم" },
  ],
  /** Company address printed in the footer */
  address: "هرات، جاده بهزاد، مارکیت فلان، طبقه دوم",
  /** Optional company logo (base64 data URL) */
  logo: "",
  /** Logo placement: "top" (above title), "center" (between title & entries), "bottom" (below entries) */
  logoPosition: "top",
  /** Logo horizontal alignment: "center", "left", "right" */
  logoAlign: "center",
  headerColor: "#cddfb8",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
};

/**
 * Migrate settings from older formats to the current structure.
 *
 * Version 2 (current):
 *  - companyName + companySubtitle are separate fields
 *  - headerEntries only contains labeled entries (phones, address, etc.)
 *
 * Version 1:
 *  - headerEntries could include unlabeled entries at the start (company name, subtitle)
 *
 * Legacy (pre-headerEntries):
 *  - Fixed fields: company, companySubtitle, phonesLeft, phonesRight
 */
function migrateOldSettings(parsed) {
  // ── Version 1 → 2: Extract unlabeled entries into companyName/companySubtitle ──
  if (parsed.headerEntries) {
    const entries = parsed.headerEntries;
    // Check if the first entry is unlabeled AND companyName is not already set
    const first = entries[0];
    if (first && !first.label?.trim() && !parsed.companyName) {
      const unlabeled = entries.filter((e) => !e.label?.trim());
      const labeled = entries.filter((e) => e.label?.trim());
      return {
        ...parsed,
        companyName: unlabeled[0]?.value || defaultSettings.companyName,
        companySubtitle: unlabeled[1]?.value || "",
        headerEntries: labeled,
      };
    }
    return parsed;
  }

  // ── Legacy format: fixed fields → headerEntries ──
  const entries = [];
  // Legacy had company + companySubtitle as separate fields
  let companyName = parsed.company || "";
  let companySubtitle = parsed.companySubtitle || "";

  if (parsed.phonesLeft) {
    entries.push({ label: "تلفن", value: parsed.phonesLeft[0] || "" });
    entries.push({ label: "تلفن", value: parsed.phonesLeft[1] || "" });
  }
  if (parsed.phonesRight) {
    entries.push({ label: "تلفن", value: parsed.phonesRight[0] || "" });
    entries.push({ label: "تلفن", value: parsed.phonesRight[1] || "" });
  }
  if (parsed.address) {
    entries.push({ label: "آدرس", value: parsed.address });
  }

  return {
    ...parsed,
    companyName: companyName || defaultSettings.companyName,
    companySubtitle: companySubtitle || defaultSettings.companySubtitle,
    headerEntries: entries.length > 0 ? entries : [...defaultSettings.headerEntries],
  };
}

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const migrated = migrateOldSettings(parsed);
      // Merge with defaults to handle any missing fields
      return { ...defaultSettings, ...migrated };
    }
  } catch (err) {
    console.warn("Failed to load invoice settings:", err);
  }
  return { ...defaultSettings };
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn("Failed to save invoice settings:", err);
  }
}

export default function useInvoiceSettings() {
  const [settings, setSettings] = useState(loadSettings);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      saveSettings(merged);
      return merged;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = { ...defaultSettings };
    saveSettings(defaults);
    setSettings(defaults);
  }, []);

  return { settings, updateSettings, resetSettings };
}
