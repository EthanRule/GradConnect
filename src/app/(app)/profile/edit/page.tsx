import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Edit Profile — GradConnect" };

export default async function ProfileEditPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const { next } = await searchParams;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user) redirect("/sign-in");

  const initialData = {
    name: user.name ?? "",
    bio: user.profile?.bio ?? "",
    major: user.profile?.major ?? "",
    skills: user.profile?.skills ?? [],
    linkedin: user.profile?.linkedin ?? "",
    github: user.profile?.github ?? "",
    twitter: user.profile?.twitter ?? "",
    website: user.profile?.website ?? "",
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-6">
        <Link
          href="/profile"
          className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-white">
          Edit your profile
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Help teammates understand what you bring to the table.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6">
        <ProfileEditForm initialData={initialData} returnTo={next} />
      </div>
    </div>
  );
}
