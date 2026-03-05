export type MinimalProfile = {
  major: string
  skills: string[]
}

export function isProfileBuildReady(profile: MinimalProfile | null | undefined) {
  return !!profile?.major && profile.skills.length > 0
}
