/* Replaces saveBtn(): hidden entirely for the read-only Captain role. */
export default function SaveButton({ readOnly = false }) {
  if (readOnly) return null;
  return <button className="btn btn-primary btn-sm">Save Changes</button>;
}
