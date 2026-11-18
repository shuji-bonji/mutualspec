// 生成元: specloop generate ts --aggregate AGG-MNT-WORK-ORDER（スケルトン）＋ 人/LLM による実装
// @specloop AGG-MNT-WORK-ORDER BHV-MNT-WORK-ORDER-LIFECYCLE
import { decidePropellerDisposition, type PropellerDisposition } from "./PropellerDisposition";

export type WorkOrderStatus = "Draft" | "Approved" | "InProgress" | "Completed" | "Cancelled";
export type Model = "QX-4" | "QX-6";

export interface PropellerInspection {
  readonly position: number;
  readonly crackFound: boolean;
  readonly chipDepthMm: number;
  readonly disposition: PropellerDisposition;
  readonly inspectorJudgement?: string;
}

export class DomainRuleViolation extends Error {
  constructor(readonly ruleId: string, message: string) {
    super(`${ruleId}: ${message}`);
  }
}

const positions = (model: Model): number[] => (model === "QX-4" ? [1, 2, 3, 4] : [1, 2, 3, 4, 5, 6]);

export class WorkOrder {
  private _status: WorkOrderStatus = "Draft";
  private readonly _inspections = new Map<number, PropellerInspection>();
  readonly events: string[] = [];

  // @specloop CMD-MNT-RAISE
  constructor(readonly workOrderId: string, readonly airframeSerial: string, readonly model: Model) {}

  get status(): WorkOrderStatus { return this._status; }
  get inspections(): PropellerInspection[] { return [...this._inspections.values()]; }

  // @specloop CMD-MNT-APPROVE
  approve(): void {
    this.transition(["Draft"], "Approved", "WorkOrderApproved");
  }

  // @specloop CMD-MNT-START INV-MNT-0001 REQ-MNT-0001
  start(): void {
    if (this._status !== "Approved") {
      throw new DomainRuleViolation("INV-MNT-0001", "作業中に移行できるのは承認済みの作業指示だけである。");
    }
    this.transition(["Approved"], "InProgress", "WorkOrderStarted");
  }

  // @specloop CMD-MNT-RECORD-INSPECTION INV-MNT-0003 REQ-MNT-0003 REQ-MNT-0004
  recordInspection(position: number, crackFound: boolean, chipDepthMm: number, inspectorJudgement?: string): PropellerInspection {
    this.require(["InProgress"]);
    if (!positions(this.model).includes(position)) throw new DomainRuleViolation("VO-MNT-PROPELLER-INSPECTION", `取付位置 ${position} は型式 ${this.model} に存在しない。`);
    const disposition = decidePropellerDisposition({ crackFound, chipDepthMm });
    const inspection: PropellerInspection = { position, crackFound, chipDepthMm, disposition, inspectorJudgement };
    this._inspections.set(position, inspection);
    if (disposition === "replace") this.events.push("PropellerReplacementRequired");
    return inspection;
  }

  // @specloop CMD-MNT-COMPLETE INV-MNT-0002 REQ-MNT-0002
  complete(): void {
    const missing = positions(this.model).filter((p) => !this._inspections.has(p));
    if (missing.length > 0) {
      throw new DomainRuleViolation("INV-MNT-0002", `未記録の取付位置: ${missing.join(", ")}`);
    }
    const pending = this.inspections.filter((i) => i.disposition === "escalate" && !i.inspectorJudgement);
    if (pending.length > 0) {
      throw new DomainRuleViolation("INV-MNT-0003", `検査員判断が未記録の取付位置: ${pending.map((i) => i.position).join(", ")}`);
    }
    this.transition(["InProgress"], "Completed", "WorkOrderCompleted");
  }

  // @specloop CMD-MNT-CANCEL
  cancel(): void {
    this.transition(["Draft", "Approved"], "Cancelled", "WorkOrderCancelled");
  }

  private require(from: WorkOrderStatus[]): void {
    if (!from.includes(this._status)) throw new DomainRuleViolation("BHV-MNT-WORK-ORDER-LIFECYCLE", `状態 ${this._status} ではこの操作はできない。`);
  }

  private transition(from: WorkOrderStatus[], to: WorkOrderStatus, event: string): void {
    this.require(from);
    this._status = to;
    this.events.push(event);
  }
}
