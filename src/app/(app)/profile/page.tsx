import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export const metadata = { title: "My Profile — GradConnect" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <ProfileCard
        user={{
          id: user.id,
          name: user.name,
          image: user.image,
          createdAt: user.createdAt,
        }}
        profile={user.profile}
        isOwnProfile
      />

      {/* Prompt to complete profile if field/trade is empty */}
      {!user.profile?.major && (
        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-600/10 p-4">
          <p className="text-sm text-amber-300">
            Complete your profile so teammates know what you bring to the table.
          </p>
          <Link href="/profile/edit">
            <Button
              size="sm"
              className="mt-3 bg-amber-600 hover:bg-amber-500 text-white"
            >
              Complete profile
            </Button>
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-6 flex gap-3">
        <Link href="/groups">
          <Button
            variant="outline"
            className="border-white/15 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
          >
            <Users className="mr-2 h-4 w-4" />
            Browse Teams
          </Button>
        </Link>
        <Link href="/groups/new">
          <Button className="bg-amber-600 hover:bg-amber-500 text-white">
            Create a Team
          </Button>
        </Link>
      </div>
    </div>
  );
}

