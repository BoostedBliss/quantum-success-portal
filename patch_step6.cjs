const fs = require('fs');

// Fix NatalWheel.tsx
let content = fs.readFileSync('src/components/NatalWheel.tsx', 'utf8');
content = content.replace(
  /export const NatalWheel: React\.FC<NatalWheelProps> = \(\{\n  chart,\n  showSacredGeometry,\n  onSelectPlanet,\n\}\) => \{/,
  "export const NatalWheel: React.FC<NatalWheelProps> = ({\n  chart,\n  showSacredGeometry,\n  onSelectPlanet,\n}) => {\n  const harmonyStats = useMemo(() => calculateDodecaIcosaHarmony(chart), [chart]);"
);
fs.writeFileSync('src/components/NatalWheel.tsx', content);
