const fs = require('fs');
const filepath = 'src/components/NatalWheel.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// Import calculateDodecaIcosaHarmony
content = content.replace(
  /FoldingMode,\n} from '\.\/SacredGeometryOverlay';/,
  "FoldingMode,\n  calculateDodecaIcosaHarmony,\n} from './SacredGeometryOverlay';"
);

// Add useMemo call inside NatalWheel component
content = content.replace(
  /export const NatalWheel: React\.FC<NatalWheelProps> = \(\{ chart, showSacredGeometry, onSelectPlanet \}?\) => \{/,
  "export const NatalWheel: React.FC<NatalWheelProps> = ({ chart, showSacredGeometry, onSelectPlanet }) => {\n  const harmonyStats = useMemo(() => calculateDodecaIcosaHarmony(chart), [chart]);"
);

// Add prop to SacredGeometryHUD
content = content.replace(
  /<SacredGeometryHUD\s+chart=\{chart\}/,
  '<SacredGeometryHUD\n          harmonyStats={harmonyStats}\n          chart={chart}'
);

// Add prop to SacredGeometryOverlay
content = content.replace(
  /<SacredGeometryOverlay\s+chart=\{chart\}/,
  '<SacredGeometryOverlay\n              harmonyStats={harmonyStats}\n              chart={chart}'
);

fs.writeFileSync(filepath, content);
