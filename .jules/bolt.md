## 2023-11-06 - Unmemoized Function Props Breaking Child Components
**Learning:** In mathematically intensive child components (like 3D renderers, or the SacredGeometryOverlay), unmemoized parent functions passed as props (like getCoordinates) will constantly invalidate the child's `useMemo` hooks. This triggers extremely expensive, unnecessary recomputations across the board (e.g. projecting icosahedron/dodecahedron matrices on simple hover).
**Action:** Always verify that utility functions passed into heavy child components are wrapped in `useCallback`.
