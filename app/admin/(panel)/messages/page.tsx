import { requireAdmin } from "@/lib/auth";
import { formatIST } from "@/lib/giveaways";
import { messagesCollection } from "@/lib/messages";
import { DeleteButton } from "@/components/admin/FormBits";
import Flash from "@/components/admin/Flash";
import { deleteMessage, toggleMessageRead } from "../../actions";

export default async function Messages({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const params = await searchParams;
  const list = await (await messagesCollection()).find({}).sort({ createdAt: -1 }).limit(500).toArray();
  const unread = list.filter((m) => !m.read).length;

  return (
    <>
      <header className="adm-head">
        <div>
          <h1>Messages</h1>
          <p>
            {list.length} message{list.length === 1 ? "" : "s"} from the contact form
            {unread > 0 && ` · ${unread} unread`}.
          </p>
        </div>
      </header>
      <Flash params={params} />
      {list.length === 0 ? (
        <p className="adm-empty">No messages yet. They&apos;ll show up here when someone uses the /contact form.</p>
      ) : (
        <ul className="adm-msgs">
          {list.map((m) => {
            const id = m._id.toString();
            // Ten-digit Indian numbers need the country code for wa.me.
            const wa = m.whatsapp && (m.whatsapp.length === 10 ? `91${m.whatsapp}` : m.whatsapp);
            return (
              <li key={id} className={`adm-msg${m.read ? "" : " adm-msg-unread"}`}>
                <div className="adm-msg-head">
                  <div>
                    <strong>{m.name}</strong>
                    {!m.read && <span className="adm-badge">New</span>}
                    <span className="adm-pill adm-pill-upcoming">{m.topic}</span>
                  </div>
                  <span className="adm-muted">{formatIST(new Date(m.createdAt).toISOString())}</span>
                </div>
                {m.bookTitle && (
                  <p className="adm-msg-book">
                    Book: <em>{m.bookTitle}</em>
                  </p>
                )}
                <p className="adm-msg-body">{m.message}</p>
                <div className="adm-msg-foot">
                  <div className="adm-msg-contact">
                    {m.email && (
                      <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message to Kitaabish")}`}>✉ {m.email}</a>
                    )}
                    {wa && (
                      <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
                        ☏ +{wa}
                      </a>
                    )}
                  </div>
                  <div className="adm-row-actions">
                    <form action={toggleMessageRead.bind(null, id, !m.read)}>
                      <button type="submit" className="adm-btn adm-btn-sm">
                        {m.read ? "Mark unread" : "Mark read"}
                      </button>
                    </form>
                    <DeleteButton action={deleteMessage.bind(null, id)} label={`message from ${m.name}`} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
