import { Caveat, Literata } from "next/font/google";

// Long-form reading serif for article bodies, and a handwritten face for margin notes.
export const literata = Literata({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-read" });
export const caveat = Caveat({ subsets: ["latin"], variable: "--font-hand" });
