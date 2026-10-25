"use server";

import { messagesCollection } from "@/lib/messages";
import { allow, clientIpHash } from "@/lib/rate-limit";
import { contactSchema, toFormState, type FormState } from "@/lib/validation";

const fields = (formData: FormData) =>
  Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;

export async function sendMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  // Bots fill every field; humans never see the hidden "website" field.
  if (String(formData.get("website") ?? "").length > 0) return { success: "Message sent!" };
  if (!(await allow("contact", 5, 60))) {
    return { error: "Too many messages from your network. Please try again in an hour, or message us on WhatsApp." };
  }

  const parsed = contactSchema.safeParse(fields(formData));
  if (!parsed.success) return toFormState(parsed.error);

  await (await messagesCollection()).insertOne({
    ...parsed.data,
    ipHash: await clientIpHash(),
    read: false,
    createdAt: new Date(),
  });

  return { success: `Thanks, ${parsed.data.name.split(" ")[0]}! Your message is with us.` };
}
