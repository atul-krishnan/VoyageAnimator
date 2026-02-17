import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020913] px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#071726]/80 p-8 text-center backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#72f7cf]">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl text-white">Lost Off Route</h1>
        <p className="mt-3 text-sm text-[#bdd0e6]">
          The page you requested is not available. Head back and continue your
          journey.
        </p>
        <Link
          className="mt-6 inline-flex rounded-full bg-[#72f7cf] px-5 py-2.5 text-sm font-semibold text-[#04221f] hover:bg-[#8bfad9]"
          href="/"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
