import type { Block } from "./blog-utils";

// Simple writing format for the admin post editor ⇄ stored content blocks.
//   ## Heading        > Pull quote        ! Kitaabish tip        - list item
//   Anything else is a paragraph; separate paragraphs with a blank line.

export function markupToBlocks(src: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];

  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ").trim() });
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "ul", items: list });
    list = [];
  };

  for (const raw of src.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      list.push(line.slice(2).trim());
      continue;
    }
    flushList();
    if (line.startsWith("## ")) {
      flushPara();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("> ")) {
      flushPara();
      blocks.push({ type: "quote", text: line.slice(2).trim() });
    } else if (line.startsWith("! ")) {
      flushPara();
      blocks.push({ type: "tip", text: line.slice(2).trim() });
    } else {
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export function blocksToMarkup(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h2":
          return `## ${b.text}`;
        case "quote":
          return `> ${b.text}`;
        case "tip":
          return `! ${b.text}`;
        case "ul":
          return b.items.map((i) => `- ${i}`).join("\n");
        default:
          return b.text;
      }
    })
    .join("\n\n");
}

export const wordCount = (blocks: Block[]) =>
  blocks.reduce((n, b) => n + (b.type === "ul" ? b.items.join(" ") : b.text).split(/\s+/).filter(Boolean).length, 0);
