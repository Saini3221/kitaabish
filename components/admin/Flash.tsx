// Success banner after a save/delete redirect (?saved=1 / ?deleted=1).
export default function Flash({ params }: { params: Record<string, string | string[] | undefined> }) {
  if (params.saved) return <p className="adm-alert adm-alert-ok">Saved — the website has been updated.</p>;
  if (params.deleted) return <p className="adm-alert adm-alert-ok">Deleted.</p>;
  return null;
}
