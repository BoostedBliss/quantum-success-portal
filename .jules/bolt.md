## 2024-05-24 - [O(1) Hash Map Optimization for Grid Rendering]
**Learning:** In a matrix or grid UI where pairwise relationships are looked up frequently (like `AspectMatrix.tsx` checking for aspects between all planets), repeatedly calling `Array.prototype.find()` creates an O(N²) bottleneck during render.
**Action:** Always pre-compute a lookup table (hash map) with `useMemo` so that grid cell rendering has O(1) access to its relationship data.
