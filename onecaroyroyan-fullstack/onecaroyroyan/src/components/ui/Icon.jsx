/*
 * Icon
 * ------------------------------------------------------------------
 * Renders one of the raw SVG strings from data/mockData.js (ICONS,
 * or a ROLE_MENUS/SETTINGS_TABS item.icon). We use
 * dangerouslySetInnerHTML here deliberately: these strings are 100%
 * hard-coded by us in mockData.js, never user input, so there's no
 * injection risk — it's the same trust boundary as writing raw JSX,
 * just easier because we didn't have to hand-convert ~40 multi-line
 * <svg> blocks into JSX attribute syntax (stroke-width -> strokeWidth,
 * etc.) one by one.
 * ------------------------------------------------------------------
 */
export default function Icon({ svg, size = 15, className, style }) {
  if (!svg) return null;
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
