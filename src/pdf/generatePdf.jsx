// ── PDF Generator ────────────────────────────────────────────
// Entry point for PDF generation. Dynamically imported to
// avoid loading @react-pdf into the main bundle.
//
// Usage:
//   const { generatePdf } = await import("../pdf/generatePdf.js");
//   await generatePdf({ tier: "full", demo: true });

import React from "react";
import { pdf } from "@react-pdf/renderer";
import registerFonts from "./registerFonts";
import { getReportData } from "../data/reportData";
import TelcharPdfDocument from "./TelcharPdfDocument";

export async function generatePdf({ tier = "full", demo = false } = {}) {
  const t0 = performance.now();

  // Register fonts (idempotent)
  registerFonts();

  // Get report data from shared adapter
  const data = getReportData(demo);
  data.tier = tier;

  console.log(`PDF: rendering ${tier} tier...`);

  // Render to blob
  const blob = await pdf(<TelcharPdfDocument data={data} />).toBlob();

  const elapsed = Math.round(performance.now() - t0);
  const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
  console.log(`PDF: generated in ${elapsed}ms, ${sizeMB}MB`);

  // Build clean filename from company name
  const safeName = data.co
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+$/, "");
  const filename = `Telchar-Report-${safeName}.pdf`;

  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { elapsed, sizeBytes: blob.size, filename };
}
