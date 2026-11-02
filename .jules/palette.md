## 2023-10-27 - Missing ARIA Labels and Focus States on Icon Buttons
**Learning:** Icon-only buttons (like traffic lights in macOS-style title bars, zoom controls, export buttons) are widely used across the application components (`MacTitleBar`, `NatalWheel`, etc). They currently rely solely on the `title` attribute for accessibility and lack explicit `focus-visible` styles, rendering them invisible to keyboard navigators and some screen readers. Custom styles often override native focus outlines.
**Action:** When working on UI components, ensure that icon-only buttons have an `aria-label` attribute and explicit `focus-visible:outline-none focus-visible:ring-2` styles (or similar focus indicators) to maintain accessibility.

## 2026-11-02 - Modals Icon Button A11y
**Learning:** Added `aria-label` and `focus-visible:ring-2` to Close and Delete icon buttons in `ProfileModal`, `OracleModal`, and `ExportModal` to ensure keyboard navigators have a clear focus state and screen readers can identify the buttons.
**Action:** Always ensure icon-only buttons have an `aria-label` and a visible focus state for better accessibility.
