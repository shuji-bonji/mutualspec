// 生成元: mutualspec generate ts --decision DEC-MNT-PROP-DISPOSITION（判断表から決定的に生成。手で編集しない）
// @mutualspec DEC-MNT-PROP-DISPOSITION
export type PropellerDisposition = "reuse" | "replace" | "escalate";

export function decidePropellerDisposition(input: { crackFound: boolean; chipDepthMm: number }): PropellerDisposition {
  const { crackFound, chipDepthMm } = input;
  if (crackFound === true) return "replace"; // R01
  if (crackFound === false && chipDepthMm < 0.5) return "reuse"; // R02
  if (crackFound === false && chipDepthMm >= 0.5 && chipDepthMm < 1.0) return "escalate"; // R03 → JDG-MNT-0001
  if (crackFound === false && chipDepthMm >= 1.0) return "replace"; // R04
  throw new Error("DEC-MNT-PROP-DISPOSITION: no rule matched (hitPolicy unique)");
}
