import "server-only";
import { getDb } from "./mongodb";

// Messages sent from the /contact form.
export type ContactMessage = {
  name: string;
  email: string;
  whatsapp: string;
  topic: string;
  bookTitle: string;
  message: string;
  ipHash: string;
  read: boolean;
  createdAt: Date;
};

export const messagesCollection = async () => (await getDb()).collection<ContactMessage>("contact_messages");
