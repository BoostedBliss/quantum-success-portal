const fs = require('fs');
const filepath = 'src/components/SacredGeometryOverlay.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// Update SacredGeometryOverlayProps
content = content.replace(
  /export interface SacredGeometryOverlayProps \{/,
  'export interface SacredGeometryOverlayProps {\n  harmonyStats: HarmonyStats;'
);

// Update SacredGeometryHUDProps
content = content.replace(
  /export interface SacredGeometryHUDProps \{/,
  'export interface SacredGeometryHUDProps {\n  harmonyStats: HarmonyStats;'
);

fs.writeFileSync(filepath, content);
