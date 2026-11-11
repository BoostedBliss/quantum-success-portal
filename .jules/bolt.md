## 2024-05-15 - [O(1) Map Lookups for Grid Rendering]
**Learning:** Rendering dense grids (like an aspect matrix) using `Array.find()` for every cell results in O(N^2) complexity where N is the number of cells.
**Action:** Always convert the data array into a Map / Dictionary beforehand (O(N)) so that cell lookups are O(1), improving render performance, particularly on unmemoized matrix components.
