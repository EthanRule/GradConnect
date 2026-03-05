type MemberProfile = { major: string } | null;

export type MatchableGroup = {
  id: string;
  name: string;
  description: string | null;
  isOpen: boolean;
  projectType: string | null;
  aiUsage: string;
  platform: string;
  lookingForMajors: string[];
  maxMembers: number;
  maxPerMajor: number;
  _count: { members: number };
  members: { user: { profile: MemberProfile } }[];
};

export type MatchableProfile = {
  major: string;
  skills: string[];
};

export type GroupMatchScore = {
  score: number;
  reasons: string[];
};

export function computeGroupMatchScore(
  group: MatchableGroup,
  profile: MatchableProfile | null,
): GroupMatchScore {
  if (!profile?.major) {
    return {
      score: 0,
      reasons: ["Complete your field/trade to unlock matching"],
    };
  }

  let score = 0;
  const reasons: string[] = [];

  const openSeats = Math.max(0, group.maxMembers - group._count.members);
  const sameFieldCount = group.members.filter(
    (m) => m.user.profile?.major === profile.major,
  ).length;
  const hasFieldCapacity = sameFieldCount < group.maxPerMajor;

  if (group.lookingForMajors.includes(profile.major)) {
    score += 45;
    reasons.push("Team is actively looking for your field/trade");
  }

  if (hasFieldCapacity) {
    score += 20;
    reasons.push("Team has room for your field/trade");
  }

  if (openSeats > 0) {
    score += Math.min(openSeats, 10);
    reasons.push(`${openSeats} open seat${openSeats === 1 ? "" : "s"} left`);
  }

  if (group.projectType) {
    score += 5;
  }

  if (group.aiUsage === "AI_HYBRID") {
    score += 5;
  }

  return { score, reasons: reasons.slice(0, 3) };
}

export function sortGroupsByMatch(
  groups: MatchableGroup[],
  profile: MatchableProfile | null,
) {
  return [...groups]
    .map((group) => ({ group, match: computeGroupMatchScore(group, profile) }))
    .sort((a, b) => b.match.score - a.match.score);
}
