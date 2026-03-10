import { useState, useEffect, useRef } from "react";
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
  color: "rgba(255,255,255,0.7)",
  letterSpacing: "0.04em",
  textDecoration: "none",
  display: "block",
  padding: "4px 0",
  transition: "color 0.15s ease",
};

const mutedStyle = {
  ...linkStyle,
  opacity: 0.3,
  pointerEvents: "none",
  cursor: "default",
};

export default function HamburgerMenu({ currentPage }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
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

      {/* Dropdown — anchored to top-right of button */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: -8,
            minWidth: 200,
            background: "rgb(18,26,44)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "14px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 9999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
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
