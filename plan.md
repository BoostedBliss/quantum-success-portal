1. **Define `HarmonyStats` type** in `SacredGeometryOverlay.tsx` based on the return type of `calculateDodecaIcosaHarmony`.
2. **Update `SacredGeometryOverlayProps`** and `SacredGeometryHUDProps` to accept `harmonyStats?: ReturnType<typeof calculateDodecaIcosaHarmony>`. Actually, maybe it's better to calculate it in `NatalWheel.tsx` and pass it down. Wait, we can just export a type `HarmonyStats = ReturnType<typeof calculateDodecaIcosaHarmony>` and require it.
3. **In `NatalWheel.tsx`**, compute `const harmonyStats = useMemo(() => calculateDodecaIcosaHarmony(chart), [chart]);` and pass `harmonyStats` to both components.
4. **Remove `useMemo` for `harmonyStats`** and `stats` in `SacredGeometryOverlay` and `SacredGeometryHUD` respectively, and use the passed prop instead.
5. **Add pre-commit steps** to verify linting and tests pass.
6. **Submit**.
