export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-cream/60 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">

        {/* Top row */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <p className="font-display text-gold text-base font-bold mb-1">
              Georgia Gas Deals
            </p>
            <p className="max-w-sm">
              Helping Georgia residents find the best natural gas rates — no signup required.
            </p>
          </div>
          <nav className="flex flex-col gap-2">
            <a href="#compare" className="hover:text-gold transition-colors">Compare Rates</a>
            <a href="#how-it-works" className="hover:text-gold transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-gold transition-colors">FAQ</a>
            <a href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</a>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-cream/10" />

        {/* Disclaimer + copyright */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-cream/40">
            Georgia Gas Deals may earn a commission when you sign up through our links. This never affects the rates shown — we sort by price, not by who pays us more.
          </p>
          <p className="text-xs text-cream/40">
            &copy; {year} Georgia Gas Deals. Not affiliated with Georgia Natural Gas, SouthStar, or any provider.
          </p>
        </div>

      </div>
    </footer>
  );
}
