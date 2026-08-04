import { ICONS } from "../../data/mockData";
import Icon from "./Icon";

/*
 * IconButton
 * ------------------------------------------------------------------
 * Replaces the original iconBtn(ic, title, onclick) template-string
 * helper:
 *   function iconBtn(ic,title,onclick){
 *     return `<button class="btn-icon" title="${title}" onclick="${onclick}">${IC[ic]}</button>`
 *   }
 * Same idea, just a component instead of a string builder, and a real
 * onClick handler instead of an inline onclick="...()" string.
 *
 * Usage: <IconButton icon="eye" title="Preview" onClick={...} />
 * ------------------------------------------------------------------
 */
export default function IconButton({ icon, title, onClick }) {
  return (
    <button className="btn-icon" title={title} onClick={onClick} type="button">
      <Icon svg={ICONS[icon]} size={14} />
    </button>
  );
}
