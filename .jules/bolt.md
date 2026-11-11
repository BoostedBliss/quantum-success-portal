## 2024-05-18 - [Sacred Geometry Duplicate Harmony Calculation]
**Learning:** `calculateDodecaIcosaHarmony` was being called twice per render inside `SacredGeometryOverlay.tsx`, once in the main overlay and once in its nested HUD component. The calculation includes an iteration over planetary aspects which is inefficient to duplicate.
**Action:** Lift the computation to the parent component (`NatalWheel.tsx`) and pass the pre-computed state to the child components to halve the time taken for this heavy calculation.
