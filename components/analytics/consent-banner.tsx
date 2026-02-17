"use client";

type ConsentBannerProps = {
  onDecision: (value: "accepted" | "declined") => void;
};

export function ConsentBanner({ onDecision }: ConsentBannerProps) {
  return (
    <aside className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-white/15 bg-[#061523]/95 p-4 text-sm text-[#c4d6ea] shadow-2xl backdrop-blur-xl sm:inset-x-0 sm:bottom-6 sm:p-5">
      <p className="pr-3 leading-relaxed">
        Voyagraph uses privacy-first analytics to measure CTA clicks and studio flows.
        No ad retargeting, and no sensitive travel data is tracked.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-full border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/10"
          onClick={() => onDecision("declined")}
          type="button"
        >
          Decline
        </button>
        <button
          className="rounded-full bg-[#72f7cf] px-4 py-2 font-semibold text-[#04221f] hover:bg-[#8bfad9]"
          onClick={() => onDecision("accepted")}
          type="button"
        >
          Allow analytics
        </button>
      </div>
    </aside>
  );
}
