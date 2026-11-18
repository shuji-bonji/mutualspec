#!/usr/bin/env node
// リポジトリ内のすべての Markdown から ```mermaid ブロックを抽出し、mermaid-cli (mmdc) で描画できるか確認する
// 使い方: node scripts/check-mermaid.mjs   （要: @mermaid-js/mermaid-cli とヘッドレス Chrome）
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "specloop-mmd-"));
const puppeteerCfg = path.join(tmp, "puppeteer.json");
fs.writeFileSync(puppeteerCfg, JSON.stringify({ args: ["--no-sandbox"], ...(process.env.PUPPETEER_EXECUTABLE_PATH ? { executablePath: process.env.PUPPETEER_EXECUTABLE_PATH } : {}) }));
const mmdc = path.join(root, "node_modules", ".bin", "mmdc");
const files = fs.readdirSync(root, { recursive: true }).filter((f) => f.endsWith(".md") && !f.includes("node_modules")).map((f) => path.join(root, f));
let n = 0, failed = 0;
for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  let buf = null, start = 0;
  lines.forEach((l, i) => {
    if (buf === null && /^```mermaid\s*$/.test(l)) { buf = []; start = i + 1; return; }
    if (buf !== null && /^```\s*$/.test(l)) {
      const input = path.join(tmp, `d${n}.mmd`), out = path.join(tmp, `d${n}.svg`);
      fs.writeFileSync(input, buf.join("\n")); n++;
      try { execFileSync(mmdc, ["-q", "-p", puppeteerCfg, "-i", input, "-o", out], { stdio: "pipe" }); }
      catch (e) { failed++; console.log(`FAIL ${path.relative(root, f)}:${start}\n${String(e.stderr).split("\n").slice(0, 6).join("\n")}`); }
      buf = null; return;
    }
    if (buf !== null) buf.push(l);
  });
}
console.log(`mermaid diagrams=${n} failed=${failed}`);
process.exit(failed ? 1 : 0);
