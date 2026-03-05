import { describe, expect, test } from "bun:test"
import { countMembersWithField, hasFieldCapacity } from "@/lib/group-rules"

describe("group field capacity rules", () => {
  const members = [
    { user: { profile: { major: "Electrical Trade" } } },
    { user: { profile: { major: "Electrical Trade" } } },
    { user: { profile: { major: "Computer Science" } } },
    { user: { profile: null } },
  ]

  test("counts members with same field/trade", () => {
    expect(countMembersWithField(members, "Electrical Trade")).toBe(2)
  })

  test("detects when field/trade cap is reached", () => {
    expect(hasFieldCapacity(members, "Electrical Trade", 2)).toBe(false)
    expect(hasFieldCapacity(members, "Electrical Trade", 3)).toBe(true)
  })
})
