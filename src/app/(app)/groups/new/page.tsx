import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { CreateGroupForm } from "@/components/groups/CreateGroupForm"

export const metadata = { title: "Create a Team — GradConnect" }

export default async function NewGroupPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/sign-in")

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create a Team</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Build your crew. Bring in people from different majors and ship something real.
        </p>
      </div>

      <CreateGroupForm />
    </div>
  )
}
