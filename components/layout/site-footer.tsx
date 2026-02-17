import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#040d16]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div className="space-y-4">
          <p className="font-display text-2xl text-white">Voyagraph</p>
          <p className="max-w-md text-sm text-[#9eb2c9]">
            Turn every journey into a cinematic route story. Build animations fast,
            preview in-browser, and prepare content that feels handcrafted.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#72f7cf]">
            Product
          </p>
          <ul className="space-y-2 text-sm text-[#bdd0e6]">
            <li>
              <Link className="hover:text-white" href="/studio">
                Studio
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/plans">
                Plans
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/waitlist">
                Waitlist
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#72f7cf]">
            Company
          </p>
          <ul className="space-y-2 text-sm text-[#bdd0e6]">
            <li>
              <Link className="hover:text-white" href="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/privacy">
                Privacy
              </Link>
            </li>
            <li>
              <Link className="hover:text-white" href="/terms">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-xs text-[#7f95ad]">
          © {new Date().getFullYear()} Voyagraph. Built for travel creators.
        </p>
      </div>
    </footer>
  );
}
