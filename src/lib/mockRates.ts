import { Rate } from "@/types/rate";

// Placeholder data — will be replaced with live Supabase data in a later step.
// Rates are illustrative; always verify with the provider before publishing.
export const mockRates: Rate[] = [
  {
    id: 1,
    provider: "Gas South",
    plan_name: "12-Month Fixed",
    plan_type: "fixed",
    rate_per_therm: 0.469,
    monthly_fee: 5.99,
    contract_months: 12,
    affiliate_url: "#",
    badge: "Best Value",
  },
  {
    id: 2,
    provider: "Georgia Natural Gas",
    plan_name: "24-Month Fixed",
    plan_type: "fixed",
    rate_per_therm: 0.499,
    monthly_fee: 4.99,
    contract_months: 24,
    affiliate_url: "#",
    badge: "Most Popular",
  },
  {
    id: 3,
    provider: "SouthStar Energy",
    plan_name: "6-Month Fixed",
    plan_type: "fixed",
    rate_per_therm: 0.489,
    monthly_fee: 7.99,
    contract_months: 6,
    affiliate_url: "#",
  },
  {
    id: 4,
    provider: "SCANA Energy",
    plan_name: "Month-to-Month",
    plan_type: "variable",
    rate_per_therm: 0.539,
    monthly_fee: 6.99,
    contract_months: 0,
    affiliate_url: "#",
  },
  {
    id: 5,
    provider: "Infinite Energy",
    plan_name: "Variable Select",
    plan_type: "variable",
    rate_per_therm: 0.579,
    monthly_fee: 0,
    contract_months: 0,
    affiliate_url: "#",
  },
];
