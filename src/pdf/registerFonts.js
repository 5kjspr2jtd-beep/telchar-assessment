// ── Font Registration for @react-pdf/renderer ────────────────
// DM Sans (variable weight) + Instrument Serif
// Called once before any PDF rendering.

import { Font } from "@react-pdf/renderer";

import DMSansVariable from "./fonts/DMSans-Variable.ttf";
import InstrumentSerifRegular from "./fonts/InstrumentSerif-Regular.ttf";
import InstrumentSerifItalic from "./fonts/InstrumentSerif-Italic.ttf";

let registered = false;

export default function registerFonts() {
  if (registered) return;
  registered = true;

  // DM Sans — register the variable font at specific weight instances
  // @react-pdf uses fontWeight to select the right instance
  Font.register({
    family: "DM Sans",
    fonts: [
      { src: DMSansVariable, fontWeight: 300 },  // Light
      { src: DMSansVariable, fontWeight: 400 },  // Regular
      { src: DMSansVariable, fontWeight: 500 },  // Medium
      { src: DMSansVariable, fontWeight: 600 },  // SemiBold
    ],
  });

  // Instrument Serif
  Font.register({
    family: "Instrument Serif",
    fonts: [
      { src: InstrumentSerifRegular, fontWeight: 400, fontStyle: "normal" },
      { src: InstrumentSerifItalic, fontWeight: 400, fontStyle: "italic" },
    ],
  });

  // Disable hyphenation (looks bad in PDF reports)
  Font.registerHyphenationCallback(word => [word]);
}
