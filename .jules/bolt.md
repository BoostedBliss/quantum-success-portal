## 2024-11-10 - Render Thrashing in Complex SVG Components
**Learning:** In complex SVG components like NatalWheel with many nested elements and frequent state updates (e.g., hovering), inline functions passed down as props or used in render cycles (like coordinate generators) can cause severe render thrashing.
**Action:** Aggressively memoize static visual layers with `useMemo` and coordinate generation functions with `useCallback` to maintain stable references and prevent unnecessary re-renders.
