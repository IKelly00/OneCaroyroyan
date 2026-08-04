import { BADGE_MAP } from "../../data/mockData";

/*
 * Badge
 * ------------------------------------------------------------------
 * Replaces: function badge(s){return `<span class="badge ${BADGE_MAP[s]||'badge-gray'}">${s}</span>`}
 * ------------------------------------------------------------------
 */
export default function Badge({ status }) {
  return <span className={`badge ${BADGE_MAP[status] || "badge-gray"}`}>{status}</span>;
}
