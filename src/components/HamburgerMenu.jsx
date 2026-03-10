import { useState } from "react";
import { Link } from "react-router-dom";
import { TELCHAR as P, FONT } from "../design/telcharDesign";

const MENU_ITEMS = [
  { label: "Back Home", to: "/", type: "link" },
  { label: "Diagnostic", to: "/assessment", type: "link" },
  { label: "ROI Calculator", to: "/?page=roi", type: "a" },
  { label: "Sample Report", to: "/report?demo=true", type: "link" },
  { label: "About", to: "/#about", type: "a" },
  { label: "Advisory Services", to: "/apply", type: "link" },
];

const linkStyle = {
  fontFamily: FONT,
  fontSize: 13,
  fontWeight: 400,
  color: P.dim,
  letterSpacing: "0.04em",
  textDecoration: "none",
};

const mutedStyle = {
  ...linkStyle,
  opacity: 0.35,
  pointerEvents: "none",
  cursor: "default",
};

export default function HamburgerMenu({ currentPage, navHeight = 64 }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 6,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <span style={{ display: "block", width: 20, height: 2, background: P.dim, borderRadius: 1, transition: "all 0.2s ease", transform: open ? "rotate(45deg) translate(3px, 3px)" : "none" }} />
        <span style={{ display: "block", width: 20, height: 2, background: P.dim, borderRadius: 1, transition: "all 0.2s ease", opacity: open ? 0 : 1 }} />
        <span style={{ display: "block", width: 20, height: 2, background: P.dim, borderRadius: 1, transition: "all 0.2s ease", transform: open ? "rotate(-45deg) translate(3px, -3px)" : "none" }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: navHeight,
            left: 0,
            right: 0,
            background: "rgb(8,15,30)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            zIndex: 999,
          }}
        >
          {MENU_ITEMS.map((item) => {
            const isCurrent = item.label === currentPage;
            const style = isCurrent ? mutedStyle : linkStyle;

            if (item.type === "a") {
              return (
                <a
                  key={item.label}
                  href={item.to}
                  onClick={() => setOpen(false)}
                  style={style}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                style={style}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
