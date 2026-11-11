## 2026-11-09 - Memoizing Coordinate Generation in SVG Components
**Learning:** The application's complex SVG components require aggressive use of `useCallback` for coordinate generation functions. Otherwise, passing unmemoized functions to child components (like `SacredGeometryOverlay`) causes severe render thrashing during high-frequency interaction states like hovering.
**Action:** Always wrap coordinate generation functions and other frequently passed-down utility functions in `useCallback` with appropriate dependencies.
