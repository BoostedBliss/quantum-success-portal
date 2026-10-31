const fs = require('fs');

// Fix NatalWheel.tsx
let content = fs.readFileSync('src/components/NatalWheel.tsx', 'utf8');
content = content.replace(
  /export const NatalWheel: React\.FC<NatalWheelProps> = \(\{ chart, showSacredGeometry, onSelectPlanet \}\) => \{/,
  "export const NatalWheel: React.FC<NatalWheelProps> = ({ chart, showSacredGeometry, onSelectPlanet }) => {\n  const harmonyStats = useMemo(() => calculateDodecaIcosaHarmony(chart), [chart]);"
);
// It seems my previous replace in NatalWheel didn't work because I used `\}?` which isn't correct. Wait, the replacement already worked or failed? Let me check NatalWheel.tsx.
fs.writeFileSync('src/components/NatalWheel.tsx', content);

// Fix SacredGeometryOverlay.tsx
let content2 = fs.readFileSync('src/components/SacredGeometryOverlay.tsx', 'utf8');
content2 = content2.replace(/stats\./g, 'harmonyStats.');
fs.writeFileSync('src/components/SacredGeometryOverlay.tsx', content2);
