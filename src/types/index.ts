import type { User, Profile, Group, GroupMember, ProjectIdea, Vote, MemberRole, CommunicationPlatform } from "@prisma/client"

export type { MemberRole, CommunicationPlatform }

export type UserWithProfile = User & {
  profile: Profile | null
}

export type GroupMemberWithUser = GroupMember & {
  user: UserWithProfile
}

export type ProjectIdeaWithVotes = ProjectIdea & {
  votes: Vote[]
  author: Pick<User, "id" | "name" | "image">
  _count: { votes: number }
}

export type GroupWithDetails = Group & {
  members: GroupMemberWithUser[]
  projectIdeas: ProjectIdeaWithVotes[]
  _count: { members: number }
}

export type GroupSummary = Group & {
  _count: { members: number }
  members: Array<{
    user: {
      profile: Pick<Profile, "major"> | null
    }
  }>
}
