import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import WhatsAppFab from "@/components/WhatsAppFab";
import { rootMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

// Site-wide SEO (title template, defaults, verification, robots) comes from Admin → SEO.
export async function generateMetadata(): Promise<Metadata> {
  return rootMetadata();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      {/* Extensions like ColorZilla add attributes to <body> before React hydrates */}
      <body suppressHydrationWarning>
        {children}
        <WhatsAppFab />
      </body>
    </html>
  );
}
