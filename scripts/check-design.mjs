#!/usr/bin/env node
// SpecLoop 設計パッケージの整合性チェッカー（参照用プロトタイプ。本実装ではない）
// - 全 JSON Schema のコンパイル
// - rules/ と examples/*/ の Spec Module（front matter + 規範ブロック）のスキーマ検証
// - loop / feedback / specloop.yaml の検証
// - ID の一意性・参照解決・コンテキスト境界・禁止語・曖昧語・状態遷移・判断表の簡易検査
// 使い方: node scripts/check-design.mjs [--mermaid-out <dir>]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import YAML from "yaml";
import { JSONPath } from "jsonpath-plus";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const mermaidOut = args.includes("--mermaid-out") ? args[args.indexOf("--mermaid-out") + 1] : null;
const findings = [];
const report = (sev, rule, file, msg) => findings.push({ sev, rule, file: path.relative(root, file), msg });

// ---------- schemas ----------
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const schemaFiles = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : p.endsWith(".json") && schemaFiles.push(p); } })(path.join(root, "schemas"));
for (const f of schemaFiles) ajv.addSchema(JSON.parse(fs.readFileSync(f, "utf8")));
const base = "https://specloop.dev/schema/0.1/";
const v = (id) => { const fn = ajv.getSchema(base + id); if (!fn) throw new Error("schema not found: " + id); return fn; };
for (const f of schemaFiles) { const id = JSON.parse(fs.readFileSync(f, "utf8")).$id; ajv.getSchema(id); }
const validate = (id, data, file, label) => {
  const fn = v(id);
  if (!fn(data)) for (const e of fn.errors) report("error", "L0", file, `${label}: ${e.instancePath || "/"} ${e.message} ${e.params ? JSON.stringify(e.params) : ""}`);
};

// ---------- module parsing ----------
const KIND_CODE = { charter: "000", glossary: "010", "context-map": "020", rules: "022", description: "040", requirements: "100", model: "200", behavior: "300", decision: "310", interface: "400", procedure: "500", scenarios: "600" };
const KIND_BLOCKS = { charter: ["charter"], glossary: ["glossary"], "context-map": ["context-map"], rules: ["rules"], description: [], requirements: ["requirements"], model: ["model"], behavior: ["behavior"], decision: ["decision"], interface: ["interface"], procedure: ["procedure"], scenarios: ["scenarios"] };
function parseModule(file) {
  const src = fs.readFileSync(file, "utf8");
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) { report("error", "L0", file, "front matter がない"); return null; }
  const fm = YAML.parse(m[1]);
  const body = src.slice(m[0].length);
  const bodyStartLine = m[0].split("\n").length;
  const lines = body.split("\n");
  const blocks = [], mermaids = [], prose = [];
  let inFence = null, buf = [], startLine = 0, generated = false;
  lines.forEach((line, i) => {
    if (line.startsWith("<!-- specloop:generated begin")) generated = true;
    if (line.startsWith("<!-- specloop:generated end")) generated = false;
    const fence = line.match(/^```(\S*)\s*(.*)$/);
    if (!inFence && fence && fence[1]) { inFence = { lang: fence[1], meta: fence[2].trim() }; buf = []; startLine = bodyStartLine + i; return; }
    if (inFence && line.startsWith("```")) {
      if (inFence.lang === "yaml" && inFence.meta.startsWith("specloop:")) blocks.push({ type: inFence.meta.slice(9), text: buf.join("\n"), line: startLine });
      if (inFence.lang === "mermaid") mermaids.push({ text: buf.join("\n"), line: startLine, generated });
      inFence = null; return;
    }
    if (inFence) buf.push(line); else prose.push({ text: line, line: bodyStartLine + i });
  });
  return { file, fm, blocks, mermaids, prose, h1: prose.filter((p) => /^# /.test(p.text)) };
}
const listMd = (d) => fs.existsSync(d) ? fs.readdirSync(d, { recursive: true }).filter((f) => f.endsWith(".md")).map((f) => path.join(d, f)) : [];

// ---------- core rules module ----------
const coreFile = path.join(root, "rules", "SMC-SPECLOOP-CORE-RULES-022A.md");
const core = parseModule(coreFile);
validate("module.schema.json", core.fm, coreFile, "front matter");
for (const b of core.blocks) validate(`blocks/${b.type}.schema.json`, YAML.parse(b.text), coreFile, `block ${b.type}`);
const coreRules = YAML.parse(core.blocks[0].text).ruleset.rules;
const ambiguous = coreRules.find((r) => r.id === "SLR-CORE-00301").patterns;
const placeholders = coreRules.find((r) => r.id === "SLR-CORE-00305").patterns;

// ---------- template modules (front matter only shape) ----------
for (const f of listMd(path.join(root, "templates"))) {
  const mod = parseModule(f);
  if (!mod) continue;
  for (const b of mod.blocks) { try { YAML.parse(b.text); } catch (e) { report("error", "L0", f, "template YAML parse error: " + e.message); } }
  if (mermaidOut) mod.mermaids.forEach((mm, i) => fs.writeFileSync(path.join(mermaidOut, `${path.basename(f, ".md")}-${i}.mmd`), mm.text));
}

// ---------- examples ----------
const ID_RE = /\b(?:(?:REQ|TERM|AGG|ENT|VO|INV|CMD|EVT|POL|BHV|DEC|JDG|PRC|SCN|IFC|REL|SLR)-[A-Z][A-Z0-9]{1,7}-[A-Z0-9][A-Z0-9-]*[A-Z0-9](?:#S[0-9]{3})?|SMC-[A-Z][A-Z0-9]{1,7}-[A-Z][A-Z0-9]{1,5}-[A-Z0-9]{1,20}-[0-9]{3}[A-Z]|FB-[0-9]{4}|LP-[0-9]{4})\b/g;
const exRoot = path.join(root, "examples");
for (const ex of fs.readdirSync(exRoot)) {
  const exDir = path.join(exRoot, ex);
  const cfgFile = path.join(exDir, "specloop.yaml");
  const cfg = YAML.parse(fs.readFileSync(cfgFile, "utf8"));
  validate("specloop.config.schema.json", cfg, cfgFile, "specloop.yaml");
  const specRoot = path.join(exDir, cfg.specRoot);
  const modules = listMd(specRoot).map(parseModule).filter(Boolean);
  const elements = new Map(); // id -> {type, context, module, data, file}
  const smcs = new Map();
  const add = (id, type, ctx, mod, data) => {
    if (elements.has(id)) report("error", "SLR-CORE-00005", mod.file, `ID 重複: ${id}`);
    elements.set(id, { id, type, context: ctx, module: mod.fm.smc, file: mod.file, data });
    const seg = id.split("-")[1];
    if (!id.startsWith("SMC-") && seg !== ctx) report("error", "SLR-CORE-00004", mod.file, `${id} のコンテキストセグメント ${seg} ≠ ${ctx}`);
  };
  let contextMap = null; const charters = {};
  for (const mod of modules) {
    const { fm, file } = mod;
    validate("module.schema.json", fm, file, "front matter");
    if (smcs.has(fm.smc)) report("error", "SLR-CORE-00005", file, `SMC 重複 ${fm.smc}`);
    smcs.set(fm.smc, mod);
    if (path.basename(file, ".md") !== fm.smc) report("error", "naming", file, "ファイル名は SMC と一致させる");
    if (fm.smc.slice(-4, -1) !== KIND_CODE[fm.kind]) report("error", "SLR-CORE-00001", file, `SMC 種別コード ${fm.smc.slice(-4, -1)} ≠ kind ${fm.kind}(${KIND_CODE[fm.kind]})`);
    if (fm.smc.split("-")[2] !== fm.context) report("error", "SLR-CORE-00004", file, "SMC のコンテキストセグメントが context と不一致");
    if (mod.h1.length !== 1) report("warning", "SLR-CORE-00007", file, `H1 が ${mod.h1.length} 個`);
    for (const b of mod.blocks) {
      if (!KIND_BLOCKS[fm.kind].includes(b.type)) report("error", "SLR-CORE-00003", file, `kind ${fm.kind} に specloop:${b.type} は置けない`);
      let data; try { data = YAML.parse(b.text); } catch (e) { report("error", "L0", file, `YAML parse (line ${b.line}): ${e.message}`); continue; }
      validate(`blocks/${b.type}.schema.json`, data, file, `block ${b.type} (line ${b.line})`);
      b.data = data;
      const ctx = fm.context;
      switch (b.type) {
        case "charter": charters[data.charter.context] = data.charter; break;
        case "context-map": contextMap = data; data.relations.forEach((r) => add(r.id, "relation", ctx, mod, r)); break;
        case "glossary": data.terms.forEach((t) => add(t.id, "term", ctx, mod, t)); break;
        case "requirements": data.requirements.forEach((r) => add(r.id, "requirement", ctx, mod, r)); break;
        case "model":
          for (const a of data.aggregates) {
            add(a.id, "aggregate", ctx, mod, a); add(a.root.id, "entity", ctx, mod, a.root);
            (a.entities || []).forEach((e) => add(e.id, "entity", ctx, mod, e));
            (a.valueObjects || []).forEach((e) => add(e.id, "valueObject", ctx, mod, e));
            (a.invariants || []).forEach((e) => add(e.id, "invariant", ctx, mod, e));
            (a.commands || []).forEach((e) => add(e.id, "command", ctx, mod, { ...e, aggregate: a.id }));
            (a.events || []).forEach((e) => add(e.id, "event", ctx, mod, e));
          }
          (data.policies || []).forEach((p) => add(p.id, "policy", ctx, mod, p));
          break;
        case "behavior": data.stateMachines.forEach((s) => add(s.id, "stateMachine", ctx, mod, s)); break;
        case "decision": data.decisions.forEach((d) => { add(d.id, "decision", ctx, mod, d); d.rules.forEach((r) => r.judgement && add(r.judgement.id, "judgement", ctx, mod, r.judgement)); }); break;
        case "interface": data.interfaces.forEach((i) => add(i.id, "interface", ctx, mod, i)); break;
        case "procedure": {
          const p = data.procedure; add(p.id, "procedure", ctx, mod, p);
          const walk = (steps) => (steps || []).forEach((s) => { elements.set(`${p.id}#${s.id}`, { id: `${p.id}#${s.id}`, type: "step", context: ctx, module: fm.smc, file, data: s }); s.judgement && add(s.judgement.id, "judgement", ctx, mod, s.judgement); walk(s.steps); });
          walk(p.steps); walk(p.closeout); break;
        }
        case "scenarios": data.scenarios.forEach((s) => add(s.id, "scenario", ctx, mod, s)); break;
        case "rules": data.ruleset.rules.forEach((r) => add(r.id, "rule", ctx, mod, r)); break;
      }
    }
    if (mermaidOut) mod.mermaids.forEach((mm, i) => fs.writeFileSync(path.join(mermaidOut, `${ex}-${path.basename(file, ".md")}-${i}.mmd`), mm.text));
  }
  // directory ↔ context (SLR-CORE-00002)
  const ctxPath = Object.fromEntries((contextMap?.contexts || []).map((c) => [c.code, c.path]));
  ctxPath.PRJ = "_project";
  for (const mod of modules) {
    const dir = path.relative(specRoot, path.dirname(mod.file));
    if (ctxPath[mod.fm.context] !== dir) report("error", "SLR-CORE-00002", mod.file, `context ${mod.fm.context} は ${ctxPath[mod.fm.context]}/ に置く（実際: ${dir}/）`);
  }
  // published set & allowed directions (SLR-CORE-00202)
  const published = new Set();
  for (const [id, e] of elements) if ((e.type === "term" && e.data.visibility === "published") || e.type === "interface" || (e.type === "event" && e.data.published)) published.add(id);
  const allowedEdges = new Set();
  for (const r of contextMap?.relations || []) {
    (r.via || []).forEach((id) => published.add(id));
    allowedEdges.add(`${r.downstream}->${r.upstream}`);
    if (r.patterns.includes("partnership") || r.patterns.includes("shared-kernel")) allowedEdges.add(`${r.upstream}->${r.downstream}`);
  }
  for (const e of elements.values()) if (e.type === "decision" && published.has(e.id)) e.data.rules.forEach((r) => r.judgement && published.add(r.judgement.id));
  const knownExtern = new Set(["SMC-SPECLOOP-CORE-RULES-022A"]);
  const roles = new Set(Object.values(charters).flatMap((c) => (c.roles || []).map((r) => r.name)));
  const checkRef = (mod, ref, where, isTrace = false) => {
    const id = ref.replace(/#S[0-9]{3}$/, (m) => m); // keep step refs
    if (knownExtern.has(id) || smcs.has(id)) return;
    if (/^(FB|LP)-/.test(id)) { const p = path.join(exDir, id.startsWith("FB") ? "feedback" : "loops", id.startsWith("FB") ? `${id}.yaml` : id); if (!fs.existsSync(p)) report("error", "SLR-CORE-00201", mod.file, `未解決参照 ${id} (${where})`); return; }
    const target = elements.get(id);
    if (!target) { report("error", "SLR-CORE-00201", mod.file, `未解決参照 ${id} (${where})`); return; }
    const from = mod.fm.context;
    if (from !== "PRJ" && target.context !== from && target.context !== "PRJ") {
      const baseId = id.replace(/#S[0-9]{3}$/, "");
      if (!isTrace && !published.has(baseId) && !published.has(id)) report("error", "SLR-CORE-00202", mod.file, `${id} は ${target.context} の非公開要素（${where}）`);
      else if (!allowedEdges.has(`${from}->${target.context}`)) report("error", "SLR-CORE-00202", mod.file, `${from}→${target.context} の参照経路が context-map にない（${id}）`);
    }
  };
  for (const mod of modules) {
    if (mod.fm.kind === "rules") continue; // rule IDs/paths are definitions
    for (const r of mod.fm.refs || []) checkRef(mod, r, "front matter refs");
    for (const b of mod.blocks) {
      if (!b.data || b.type === "context-map") continue;
      const TRACE_KEYS = /\b(satisfies|derivesFrom|refines|satisfiedBy|verifiedBy|verifies|requirement|conflictsWith|affects):/;
      b.text.split("\n").forEach((line, li) => {
        for (const m of line.matchAll(ID_RE)) {
          const id = m[0];
          if (new RegExp(`(^|[{,\\s])id:\\s*${id}\\b`).test(line) && elements.get(id)?.module === mod.fm.smc) continue; // 定義
          checkRef(mod, id, `block ${b.type} line ${b.line + li + 1}`, TRACE_KEYS.test(line));
        }
      });
    }
    for (const p of mod.prose) for (const m of p.text.matchAll(ID_RE)) checkRef(mod, m[0], `prose line ${p.line}`);
    for (const mm of mod.mermaids) for (const m of mm.text.matchAll(ID_RE)) checkRef(mod, m[0], `mermaid line ${mm.line}`);
  }
  // vocabulary: forbidden terms (SLR-CORE-00101) — own context + published terms used by this context
  const forbiddenBy = {};
  for (const e of elements.values()) if (e.type === "term") for (const f of e.data.forbidden || []) (forbiddenBy[e.context] ||= []).push({ ...f, term: e.data.term, id: e.id, published: published.has(e.id) });
  var textFields = ["statement", "rationale", "text", "criteria", "question", "given", "when", "then", "definition", "purpose", "description", "summary"];
  const collectTexts = (obj, out = [], key = "") => { if (typeof obj === "string") { if (textFields.includes(key)) out.push(obj); } else if (Array.isArray(obj)) obj.forEach((x) => collectTexts(x, out, key)); else if (obj && typeof obj === "object") for (const [k, x] of Object.entries(obj)) if (k !== "forbidden" && k !== "aliases") collectTexts(x, out, k); return out; };
  for (const mod of modules) {
    const ctx = mod.fm.context;
    const usedCtx = new Set([ctx]);
    for (const m of [...mod.blocks.map((b) => b.text), ...mod.prose.map((p) => p.text)].join("\n").matchAll(ID_RE)) { const t = elements.get(m[0]); if (t?.type === "term") usedCtx.add(t.context); }
    const list = [...usedCtx].flatMap((c) => (forbiddenBy[c] || []).filter((f) => c === ctx || f.published));
    const texts = [...mod.blocks.filter((b) => b.data && b.type !== "glossary").flatMap((b) => collectTexts(b.data)), ...mod.prose.filter((p) => !p.text.startsWith("|")).map((p) => p.text), mod.fm.summary || ""];
    // 日本語は語境界がないため、正式用語・別表記の出現箇所をマスクしてから禁止語を探す（最長一致マスキング）
    const allowed = [...elements.values()].filter((e) => e.type === "term").flatMap((e) => [e.data.term, ...(e.data.aliases || [])]).sort((a, b) => b.length - a.length);
    const mask = (t, fw) => allowed.filter((a) => a.length > fw.length && a.includes(fw)).reduce((acc, a) => acc.split(a).join("\u0000".repeat(a.length)), t);
    for (const t of texts) for (const f of list) if (mask(t, f.text).includes(f.text)) report("error", "SLR-CORE-00101", mod.file, `禁止語「${f.text}」→「${f.term}」(${f.id}): ${t.slice(0, 40)}`);
  }
  // ambiguity / placeholders on requirements, invariants, steps
  for (const e of elements.values()) {
    const texts = [];
    if (e.type === "requirement") texts.push(typeof e.data.statement === "string" ? e.data.statement : Object.values(e.data.statement).join(" "), ...e.data.verification.criteria);
    if (e.type === "invariant") texts.push(e.data.statement);
    if (e.type === "step") texts.push(e.data.text);
    for (const t of texts) {
      for (const p of ambiguous) if (p.regex ? new RegExp(p.match, "i").test(t) : t.includes(p.match)) report("error", "SLR-CORE-00301", e.file, `${e.id}: 曖昧語「${p.match}」: ${t.slice(0, 40)}`);
      for (const p of placeholders) if (p.regex ? new RegExp(p.match).test(t) : t.includes(p.match)) report("error", "SLR-CORE-00305", e.file, `${e.id}: プレースホルダ「${p.match}」`);
    }
    if (e.type === "requirement" && e.data.priority === "must" && !(e.data.trace?.verifiedBy || []).length) report("warning", "SLR-CORE-00207", e.file, `${e.id} に verifiedBy がない`);
    if (e.type === "requirement" && !/(しなければならない|してはならない|\bshall\b)/.test(String(e.data.statement))) report("warning", "SLR-CORE-00304", e.file, `${e.id}: 文型不一致`);
    if (e.type === "invariant" && !(e.data.enforcedBy || []).length) report("warning", "SLR-CORE-00206", e.file, `${e.id} に enforcedBy がない`);
    if (e.type === "judgement") { if (!roles.has(e.data.by)) report("error", "SLR-CORE-00210", e.file, `${e.id}: ロール ${e.data.by} 未宣言`); if (e.data.escalateTo && !roles.has(e.data.escalateTo)) report("error", "SLR-CORE-00210", e.file, `${e.id}: ロール ${e.data.escalateTo} 未宣言`); }
  }
  // vocabulary: names match term codes (SLR-CORE-00103), term refs resolve (00102)
  for (const e of elements.values()) {
    const termOf = (tid) => elements.get(tid)?.data?.code;
    if (["aggregate", "command", "event", "valueObject"].includes(e.type) && e.data.term && termOf(e.data.term) !== e.data.name) report("error", "SLR-CORE-00103", e.file, `${e.id}: name ${e.data.name} ≠ term code ${termOf(e.data.term)}`);
    if (e.type === "stateMachine") for (const s of e.data.states) if (termOf(s.term) !== s.name) report("error", "SLR-CORE-00103", e.file, `${e.id}: state ${s.name} ≠ ${termOf(s.term)}`);
  }
  // state machines (SLR-CORE-00203/00204)
  for (const e of elements.values()) if (e.type === "stateMachine") {
    const sm = e.data, names = new Set(sm.states.map((s) => s.name));
    if (!names.has(sm.initial)) report("error", "SLR-CORE-00203", e.file, `${e.id}: initial ${sm.initial} 不明`);
    const reach = new Set([sm.initial]); let grew = true;
    while (grew) { grew = false; for (const t of sm.transitions) if (reach.has(t.from) && !reach.has(t.to)) { reach.add(t.to); grew = true; } }
    for (const s of sm.states) {
      if (!reach.has(s.name)) report("error", "SLR-CORE-00203", e.file, `${e.id}: ${s.name} に到達できない`);
      if (!s.final && !sm.transitions.some((t) => t.from === s.name && t.to !== s.name)) report("error", "SLR-CORE-00203", e.file, `${e.id}: ${s.name} から出られない`);
    }
    for (const t of sm.transitions) { const c = elements.get(t.on); if (c && c.data.aggregate !== sm.subject) report("error", "SLR-CORE-00204", e.file, `${t.on} は ${sm.subject} のコマンドではない`); }
  }
  // decision tables (SLR-CORE-00205) — numeric/boolean sampling check
  const unary = (test, x) => {
    if (test === "-" ) return true;
    if (typeof test === "boolean" || typeof test === "number") return x === test;
    let m;
    if ((m = test.match(/^(<=|>=|<|>)\s*(-?[\d.]+)$/))) { const n = +m[2]; return { "<": x < n, "<=": x <= n, ">": x > n, ">=": x >= n }[m[1]]; }
    if ((m = test.match(/^([\[(])\s*(-?[\d.]+)\.\.(-?[\d.]+)\s*([\])])$/))) { const lo = +m[2], hi = +m[3]; return (m[1] === "[" ? x >= lo : x > lo) && (m[4] === "]" ? x <= hi : x < hi); }
    return test.split("|").includes(String(x));
  };
  for (const e of elements.values()) if (e.type === "decision") {
    const ins = new Map(e.data.inputs.map((i) => [i.name, i])), outs = new Map(e.data.outputs.map((o) => [o.name, o]));
    for (const r of e.data.rules) {
      for (const [k, t] of Object.entries(r.when)) { if (!ins.has(k)) report("error", "SLR-CORE-00211", e.file, `${e.id} ${r.id}: 未宣言の入力 ${k}`); else if (ins.get(k).type === "enum" && t !== "-" && !String(t).split("|").every((x) => ins.get(k).values.includes(x))) report("error", "SLR-CORE-00211", e.file, `${e.id} ${r.id}: ${k} の値 ${t} は values 外`); }
      for (const [k, t] of Object.entries(r.then)) { if (!outs.has(k)) report("error", "SLR-CORE-00211", e.file, `${e.id} ${r.id}: 未宣言の出力 ${k}`); else if (outs.get(k).values && !outs.get(k).values.includes(String(t))) report("error", "SLR-CORE-00211", e.file, `${e.id} ${r.id}: ${k}=${t} は values 外`); }
    }
  }
  for (const e of elements.values()) if (e.type === "decision" && e.data.hitPolicy === "unique") {
    const d = e.data;
    const samples = d.inputs.map((i) => i.type === "boolean" ? [true, false] : i.type === "enum" ? i.values : (() => { const pts = new Set([0]); d.rules.forEach((r) => { const t = String(r.when[i.name] ?? "-"); (t.match(/-?\d+(\.\d+)?/g) || []).forEach((n) => { pts.add(+n); pts.add(+n - 0.001); pts.add(+n + 0.001); }); }); return [...pts].filter((n) => n >= 0); })());
    const combos = samples.reduce((acc, vals) => acc.flatMap((a) => vals.map((x) => [...a, x])), [[]]);
    for (const c of combos) {
      const hits = d.rules.filter((r) => d.inputs.every((inp, k) => unary(r.when[inp.name] ?? "-", c[k])));
      if (hits.length !== 1) report("error", "SLR-CORE-00205", e.file, `${e.id}: 入力 ${JSON.stringify(c)} に ${hits.length} 行一致`);
    }
  }
  // ---------- SLRX: structure rules (select/path/flag/values) と lexicon 語彙ルール ----------
  const graph = {
    modules: modules.map((m) => ({ smc: m.fm.smc, kind: m.fm.kind, context: m.fm.context, status: m.fm.status, issue: `${String(m.fm.issue.number).padStart(3, "0")}-${String(m.fm.issue.inWork).padStart(2, "0")}`, file: m.file })),
    elements: [...elements.values()].map(({ id, type, context, module, data, file }) => ({ id, type, context, module, data, file })),
  };
  const ruleModules = [core, ...modules.filter((m) => m.fm.kind === "rules")];
  const ruleList = ruleModules.flatMap((m) => m.blocks.filter((b) => b.type === "rules").flatMap((b) => YAML.parse(b.text).ruleset.rules));
  const getPath = (obj, p) => p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
  const matchValue = (val, spec) => {
    const s = String(val);
    if (spec.form === "single") return s === String(spec.allowed);
    if (spec.form === "pattern") return new RegExp(`^(?:${spec.allowed})$`).test(s);
    if (spec.form === "range") { const [lo, hi] = String(spec.allowed).split("~"); return s >= lo && s <= hi; }
    return false;
  };
  for (const r of ruleList.filter((r) => r.kind === "structure" && r.select)) {
    const targets = JSONPath({ path: r.select, json: graph });
    for (const t of targets) {
      const val = r.path ? getPath(t, r.path) : t;
      const present = val !== undefined && val !== null && !(Array.isArray(val) && val.length === 0);
      const where = t.id || t.smc;
      const file = t.file || "?";
      if (r.flag === 0 && present) report(r.severity, r.id, file, `${where}: ${r.use}`);
      if (r.flag === 1 && !present) report(r.severity, r.id, file, `${where}: ${r.path} がない — ${r.use}`);
      if ((r.flag === 1 || r.flag === 2) && present && r.values?.length) {
        const vals = Array.isArray(val) ? val : [val];
        for (const x of vals) if (typeof x !== "object" && !r.values.some((spec) => matchValue(x, spec))) report(r.severity, r.id, file, `${where}: ${r.path}=${x} は許可値外 — ${r.use}`);
      }
    }
  }
  for (const r of ruleList.filter((r) => r.kind === "vocabulary" && r.check === "lexicon")) {
    for (const e of graph.elements) {
      const data = e.type === "procedure" ? { ...e.data, steps: undefined, closeout: undefined } : e.data; // ステップは step 要素側で検査
      const texts = collectTexts(data);
      for (const t of texts) for (const p of r.patterns) if (p.regex ? new RegExp(p.match).test(t) : t.includes(p.match)) report(r.severity, r.id, e.file, `${e.id}: 「${p.match}」${p.hint ? " → " + p.hint : ""}`);
    }
  }
  // loops & feedback
  for (const l of fs.readdirSync(path.join(exDir, "loops"))) { const f = path.join(exDir, "loops", l, "loop.yaml"); validate("loop.schema.json", YAML.parse(fs.readFileSync(f, "utf8")), f, "loop"); }
  for (const fb of fs.readdirSync(path.join(exDir, "feedback"))) {
    const f = path.join(exDir, "feedback", fb); const data = YAML.parse(fs.readFileSync(f, "utf8"));
    validate("feedback.schema.json", data, f, "feedback");
    for (const a of data.affects || []) if (!elements.has(a)) report("error", "SLR-CORE-00201", f, `未解決参照 ${a}`);
  }
  // code annotations → trace (SLR-CORE-00201 for code refs)
  for (const dir of cfg.trace.codeRoots) {
    const d = path.join(exDir, dir); if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d, { recursive: true }).filter((x) => /\.(ts|js)$/.test(x))) {
      const src = fs.readFileSync(path.join(d, f), "utf8");
      for (const line of src.split("\n").filter((l) => l.includes(cfg.trace.annotation))) for (const m of line.matchAll(ID_RE)) if (!elements.has(m[0])) report("error", "SLR-CORE-00201", path.join(d, f), `注釈の未解決参照 ${m[0]}`);
    }
  }
  console.log(`[${ex}] modules=${modules.length} elements=${elements.size}`);
}

const errs = findings.filter((f) => f.sev === "error");
for (const f of findings) console.log(`${f.sev.toUpperCase().padEnd(7)} ${f.rule.padEnd(15)} ${f.file}  ${f.msg}`);
console.log(`schemas=${schemaFiles.length} findings: error=${errs.length} warning=${findings.length - errs.length}`);
process.exit(errs.length ? 1 : 0);
