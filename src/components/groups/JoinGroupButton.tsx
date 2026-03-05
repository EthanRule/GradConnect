"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { trackClientEvent } from "@/lib/analytics";

export function JoinGroupButton({
  groupId,
  token,
}: {
  groupId: string;
  token?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function join() {
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(token ? { token } : {}),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Failed to join team");
        return;
      }

      toast.success("You joined the team!");
      trackClientEvent("team_joined", { groupId });
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={join}
      disabled={loading}
      className="bg-amber-600 hover:bg-amber-500 text-white"
      size="sm"
    >
      {loading ? "Joining..." : "Join Team"}
    </Button>
  );
}
