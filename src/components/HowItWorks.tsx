const STEPS = [
  {
    number: "1",
    title: "Browse current rates",
    body: "We pull rates from every certified natural gas marketer in Georgia and list them in one place. No account needed — just scroll.",
  },
  {
    number: "2",
    title: "Compare by what you'll actually pay",
    body: "We calculate an estimated monthly bill for each plan using average Georgia usage (50 therms/month). Sort by price, not by who advertises the most.",
  },
  {
    number: "3",
    title: "Sign up directly with the provider",
    body: "Click Sign Up and you go straight to the provider's site. Your service address and gas delivery stay the same — only the company billing you changes.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-navy py-16 sm:py-24 px-4">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">

        {/* Header */}
        <div className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream">
            How it works
          </h2>
          <p className="mt-3 text-cream/60 text-sm sm:text-base max-w-xl mx-auto">
            Switching natural gas providers in Georgia takes about 5 minutes and
            doesn&apos;t interrupt your service.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">

          {/* Connector line — desktop only */}
          <div className="hidden sm:block absolute top-7 left-[calc(16.666%+1rem)] right-[calc(16.666%+1rem)] h-px bg-cream/10" />

          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col gap-4 items-start sm:items-center sm:text-center">

              {/* Step number bubble */}
              <div className="relative z-10 w-14 h-14 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                <span className="font-display text-xl font-bold text-navy">
                  {step.number}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-cream text-base sm:text-lg">
                  {step.title}
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                  {step.body}
                </p>
              </div>

            </div>
          ))}

        </div>

        {/* Bottom reassurance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {[
            { stat: "0", label: "Impact on your gas delivery" },
            { stat: "5 min", label: "Average time to switch" },
            { stat: "100%", label: "Certified GA providers only" },
          ].map((item) => (
            <div key={item.label} className="bg-cream/5 rounded-xl py-5 px-4 flex flex-col gap-1">
              <span className="font-display text-2xl font-bold text-gold">{item.stat}</span>
              <span className="text-cream/60 text-sm">{item.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
