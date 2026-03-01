import { Rate } from "@/types/rate";

const AVG_THERMS = 50;

function estimatedMonthly(rate: Rate): number {
  return rate.rate_per_therm * AVG_THERMS + rate.monthly_fee;
}

// Renders JSON-LD structured data in <script> tags.
// Data comes from our own database — not user input — so dangerouslySetInnerHTML is safe here.
export default function JsonLd({ rates }: { rates: Rate[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://georgia-gas-deals.vercel.app";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Georgia Gas Deals",
    url: siteUrl,
    description:
      "Compare natural gas rates from every certified Georgia provider. Sorted by estimated monthly cost.",
  };

  const sorted = [...rates].sort((a, b) => estimatedMonthly(a) - estimatedMonthly(b));

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Current Georgia Natural Gas Rates",
    description:
      "Natural gas rates from certified Georgia marketers, sorted by estimated monthly cost based on 50 therms/month average usage.",
    numberOfItems: sorted.length,
    itemListElement: sorted.map((rate, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `${rate.provider} — ${rate.plan_name}`,
        description: `${
          rate.plan_type === "fixed" ? "Fixed" : "Variable"
        } rate natural gas plan. $${rate.rate_per_therm.toFixed(3)}/therm + $${rate.monthly_fee.toFixed(2)}/month customer charge.`,
        offers: {
          "@type": "Offer",
          price: estimatedMonthly(rate).toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: rate.affiliate_url === "#" ? siteUrl : rate.affiliate_url,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  );
}
