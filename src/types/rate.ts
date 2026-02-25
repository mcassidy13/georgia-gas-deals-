export type PlanType = "fixed" | "variable";

export interface Rate {
  id: number;
  provider: string;
  plan_name: string;
  plan_type: PlanType;
  rate_per_therm: number;   // e.g. 0.469  (dollars per therm)
  monthly_fee: number;       // flat monthly customer charge
  contract_months: number;   // 0 = month-to-month
  affiliate_url: string;
  badge?: string;            // optional label e.g. "Best Value"
}
