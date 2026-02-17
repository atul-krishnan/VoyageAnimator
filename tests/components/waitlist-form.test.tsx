import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { WaitlistForm } from "@/components/forms/waitlist-form";

describe("WaitlistForm", () => {
  it("submits with valid values", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, id: "1" }), { status: 201 }));

    render(<WaitlistForm sourcePage="home" />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "creator@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/How will you use Voyagraph/i), {
      target: {
        value:
          "I create travel guides every week and need cinematic route intros for each episode.",
      },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /Join Waitlist/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledOnce();
      expect(screen.getByText(/You are on the list/i)).toBeInTheDocument();
    });

    fetchMock.mockRestore();
  });
});
