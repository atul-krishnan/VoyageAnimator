"use client";

import { useState } from "react";

import { trackEvent } from "@/lib/analytics/client";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import type { SourcePage, WaitlistSignupInput } from "@/lib/types";
import { waitlistSignupSchema } from "@/lib/validation";

type WaitlistFormProps = {
  sourcePage: SourcePage;
  compact?: boolean;
};

type FormState = {
  email: string;
  creatorType: WaitlistSignupInput["creatorType"];
  useCase: string;
  consent: boolean;
};

const initialState: FormState = {
  email: "",
  creatorType: "travel_creator",
  useCase: "",
  consent: false,
};

export function WaitlistForm({ sourcePage, compact = false }: WaitlistFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: WaitlistSignupInput = {
      email: form.email,
      creatorType: form.creatorType,
      useCase: form.useCase,
      sourcePage,
      consent: form.consent,
    };

    const parsed = waitlistSignupSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your input");
      setSuccess(null);
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to join waitlist");
      }

      setForm(initialState);
      setSuccess("You are on the list. We will send early access updates soon.");
      trackEvent(ANALYTICS_EVENTS.waitlistSubmitted, { sourcePage });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      className="space-y-4 rounded-2xl border border-white/12 bg-[#051322]/70 p-5 backdrop-blur-xl"
      onSubmit={submit}
    >
      <div className={compact ? "grid gap-3" : "grid gap-4 sm:grid-cols-2"}>
        <label className="space-y-2 text-sm">
          <span className="font-medium text-[#cae0f5]">Email</span>
          <input
            className="h-11 w-full rounded-xl border border-white/15 bg-[#091d31] px-3 text-white outline-none ring-[#72f7cf] placeholder:text-[#88a1ba] focus:ring-2"
            onChange={(event) =>
              setForm((state) => ({ ...state, email: event.target.value }))
            }
            placeholder="creator@email.com"
            required
            type="email"
            value={form.email}
          />
        </label>

        <label className="space-y-2 text-sm">
          <span className="font-medium text-[#cae0f5]">I am a</span>
          <select
            className="h-11 w-full rounded-xl border border-white/15 bg-[#091d31] px-3 text-white outline-none ring-[#72f7cf] focus:ring-2"
            onChange={(event) =>
              setForm((state) => ({
                ...state,
                creatorType: event.target.value as WaitlistSignupInput["creatorType"],
              }))
            }
            value={form.creatorType}
          >
            <option value="travel_creator">Travel creator</option>
            <option value="agency">Agency / operator</option>
            <option value="traveler">Independent traveler</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm">
        <span className="font-medium text-[#cae0f5]">How will you use Voyagraph?</span>
        <textarea
          className="min-h-24 w-full rounded-xl border border-white/15 bg-[#091d31] px-3 py-2 text-white outline-none ring-[#72f7cf] placeholder:text-[#88a1ba] focus:ring-2"
          onChange={(event) =>
            setForm((state) => ({ ...state, useCase: event.target.value }))
          }
          placeholder="Example: I create weekly recap reels for road trips and need faster map animations."
          required
          value={form.useCase}
        />
      </label>

      <label className="flex items-start gap-2 text-sm text-[#bdd0e6]">
        <input
          checked={form.consent}
          className="mt-1"
          onChange={(event) =>
            setForm((state) => ({ ...state, consent: event.target.checked }))
          }
          required
          type="checkbox"
        />
        <span>
          I agree to receive early-access and product updates from Voyagraph.
        </span>
      </label>

      {error ? <p className="text-sm text-[#ff9d9d]">{error}</p> : null}
      {success ? <p className="text-sm text-[#8bfad9]">{success}</p> : null}

      <button
        className="h-11 w-full rounded-full bg-[#72f7cf] px-4 text-sm font-semibold text-[#04221f] transition hover:bg-[#8bfad9] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Joining..." : "Join Waitlist"}
      </button>
    </form>
  );
}
