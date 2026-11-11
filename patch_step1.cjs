const fs = require('fs');
const filepath = 'src/components/SacredGeometryOverlay.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// Export the HarmonyStats type
const typeDefinition = `
export type HarmonyStats = ReturnType<typeof calculateDodecaIcosaHarmony>;
`;

content = content.replace(
  /export interface SacredGeometryOverlayProps {/,
  typeDefinition + '\nexport interface SacredGeometryOverlayProps {'
);

fs.writeFileSync(filepath, content);
