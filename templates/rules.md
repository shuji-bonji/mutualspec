---
mutualspec: "0.1"
smc: SMC-{{PROJECT}}-{{CONTEXT}}-{{SUBJECT}}-022A
kind: rules
title: "{{タイトル}}"
summary: "{{1 行要約（Context Pack の目次に使う）}}"
context: "{{CONTEXT}}"
issue: { number: 0, inWork: 1 }
status: draft
language: ja
owner: "{{@owner}}"
---

# {{タイトル}}

## 背景（informative）

{{このモジュールが必要になった背景。規範はここに書かず、下のブロックに書く。}}

## 規範（normative）

```yaml mutualspec:rules
ruleset:
  id: "{{SMC}}"
  layer: project
  extends: [SMC-MSPEC-CORE-RULES-022A]
  rules:
    - id: "MSR-{{CONTEXT}}-00001"
      kind: structure
      select: "$.elements[?(@.type == 'requirement')]"
      path: data.priority
      flag: 2
      values:
        - { form: single, allowed: must }
      use: "{{人と LLM が読む規則文}}"
      severity: error
```
