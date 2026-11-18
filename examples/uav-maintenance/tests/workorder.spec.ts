// テスト名に SCN ID を含め、JUnit XML 経由で specloop trace が検証結果を取り込む
import { describe, expect, it } from "vitest";
import { WorkOrder } from "../src/contexts/maintenance/WorkOrder";

const inProgress = () => {
  const wo = new WorkOrder("WO-TEST-1", "SN-0001", "QX-4");
  wo.approve();
  wo.start();
  return wo;
};

describe("AGG-MNT-WORK-ORDER", () => {
  // @specloop SCN-MNT-0001
  it("SCN-MNT-0001 承認前の作業指示には着手できない", () => {
    const wo = new WorkOrder("WO-TEST-1", "SN-0001", "QX-4");
    expect(() => wo.start()).toThrow(/INV-MNT-0001/);
    expect(wo.status).toBe("Draft");
  });

  // @specloop SCN-MNT-0002
  it.each([
    [true, 0.2, "replace"],
    [false, 0.2, "reuse"],
    [false, 0.7, "escalate"],
    [false, 1.2, "replace"],
  ] as const)("SCN-MNT-0002 crack=%s depth=%s → %s", (crack, depth, expected) => {
    expect(inProgress().recordInspection(1, crack, depth).disposition).toBe(expected);
  });

  // @specloop SCN-MNT-0003
  it("SCN-MNT-0003 点検結果が欠けていると完了できない", () => {
    const wo = inProgress();
    [1, 2, 3].forEach((p) => wo.recordInspection(p, false, 0.1));
    expect(() => wo.complete()).toThrow(/未記録の取付位置: 4/);
  });
});
