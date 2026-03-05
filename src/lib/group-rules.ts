type MemberProfile = { major: string } | null

export function countMembersWithField(
  members: { user: { profile: MemberProfile } }[],
  field: string
) {
  return members.filter((m) => m.user.profile?.major === field).length
}

export function hasFieldCapacity(
  members: { user: { profile: MemberProfile } }[],
  field: string,
  maxPerField: number
) {
  return countMembersWithField(members, field) < maxPerField
}
