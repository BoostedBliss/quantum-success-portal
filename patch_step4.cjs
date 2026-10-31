const fs = require('fs');
const filepath = 'src/components/SacredGeometryOverlay.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// In SacredGeometryOverlay component
content = content.replace(
  /export const SacredGeometryOverlay: React\.FC<SacredGeometryOverlayProps> = \(\{\n  chart,/g,
  'export const SacredGeometryOverlay: React.FC<SacredGeometryOverlayProps> = ({\n  harmonyStats,\n  chart,'
);
// Remove useMemo in SacredGeometryOverlay
content = content.replace(
  /  \/\/ Detect harmonious alignments between planetary and asteroid bodies\n  const harmonyStats = useMemo\(\(\) => calculateDodecaIcosaHarmony\(chart\), \[chart\]\);\n/,
  '  // Detect harmonious alignments between planetary and asteroid bodies (passed from parent)\n'
);

// In SacredGeometryHUD component
content = content.replace(
  /export const SacredGeometryHUD: React\.FC<SacredGeometryHUDProps> = \(\{\n  chart,/g,
  'export const SacredGeometryHUD: React.FC<SacredGeometryHUDProps> = ({\n  harmonyStats,\n  chart,'
);
// Remove useMemo in SacredGeometryHUD
content = content.replace(
  /  const stats = useMemo\(\(\) => calculateDodecaIcosaHarmony\(chart\), \[chart\]\);\n  const asteroidHarmonics = stats\.asteroidHarmonics;/g,
  '  const asteroidHarmonics = harmonyStats.asteroidHarmonics;'
);

fs.writeFileSync(filepath, content);
