"use client";

import Image from "next/image";
import { ThumbsUp, Trash2 } from "lucide-react";
import { useVote } from "@/hooks/useVote";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type IdeaCardProps = {
  groupId: string;
  idea: {
    id: string;
    title: string;
    description: string;
    author: { id: string; name: string | null; image: string | null };
    _count: { votes: number };
    votes: { userId: string }[];
  };
  currentUserId: string | null;
  isCreator: boolean;
};

export function IdeaCard({
  groupId,
  idea,
  currentUserId,
  isCreator,
}: IdeaCardProps) {
  const router = useRouter();
  const hasVoted = idea.votes.some((v) => v.userId === currentUserId);

  const {
    count,
    hasVoted: voted,
    toggle,
    loading,
  } = useVote(groupId, idea.id, {
    count: idea._count.votes,
    hasVoted,
  });

  const isAuthor = idea.author.id === currentUserId;

  async function deleteIdea() {
    try {
      const res = await fetch(`/api/groups/${groupId}/ideas/${idea.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(
          (data as { error?: string }).error ?? "Failed to delete idea",
        );
        return;
      }
      toast.success("Idea deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const initials = idea.author.name
    ? idea.author.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
      <div className="flex items-start gap-3">
        {/* Vote button */}
        <button
          onClick={currentUserId ? toggle : undefined}
          disabled={loading || !currentUserId}
          className={`flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            voted
              ? "bg-violet-600/25 text-violet-300"
              : "bg-zinc-800/60 text-zinc-500 hover:bg-zinc-800 hover:text-white"
          } disabled:cursor-not-allowed`}
          title={
            currentUserId
              ? voted
                ? "Remove vote"
                : "Vote for this idea"
              : "Sign in to vote"
          }
        >
          <ThumbsUp className={`h-4 w-4 ${voted ? "fill-violet-400" : ""}`} />
          <span className="text-xs">{count}</span>
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-white">{idea.title}</h4>
            {(isAuthor || isCreator) && (
              <button
                onClick={deleteIdea}
                className="shrink-0 text-zinc-600 hover:text-red-400 transition-colors"
                title="Delete idea"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
            {idea.description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            {idea.author.image ? (
              <Image
                src={idea.author.image}
                alt={idea.author.name ?? ""}
                width={18}
                height={18}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-violet-600/30 text-[10px] font-semibold text-violet-300">
                {initials}
              </div>
            )}
            <span className="text-xs text-zinc-600">
              {idea.author.name ?? "Anonymous"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
