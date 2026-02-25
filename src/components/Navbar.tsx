export default function Navbar() {
  return (
    <header className="bg-navy text-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex flex-col leading-tight">
          <span className="font-display text-xl font-bold text-gold">
            Georgia Gas Deals
          </span>
          <span className="text-xs text-cream/60 hidden sm:block">
            Natural Gas Rate Comparison
          </span>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#compare" className="text-cream/80 hover:text-gold transition-colors">
            Compare Rates
          </a>
          <a href="#how-it-works" className="text-cream/80 hover:text-gold transition-colors">
            How It Works
          </a>
          <a href="#faq" className="text-cream/80 hover:text-gold transition-colors">
            FAQ
          </a>
        </nav>

        {/* CTA button */}
        <a
          href="#compare"
          className="bg-flame text-cream text-sm font-semibold px-4 py-2 rounded-lg hover:bg-flame/90 transition-colors"
        >
          Compare Now
        </a>

      </div>
    </header>
  );
}
