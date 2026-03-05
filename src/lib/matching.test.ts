import { describe, expect, test } from "bun:test";
import { computeGroupMatchScore } from "@/lib/matching";

describe("computeGroupMatchScore", () => {
  const baseGroup = {
    id: "g1",
    name: "Team One",
    description: null,
    isOpen: true,
    projectType: "AI Tool",
    aiUsage: "AI_HYBRID",
    platform: "DISCORD",
    lookingForMajors: ["Electrical Trade", "Computer Science"],
    maxMembers: 20,
    maxPerMajor: 5,
    _count: { members: 8 },
    members: [{ user: { profile: { major: "Marketing" } } }],
  };

  test("scores high when group is looking for user's field/trade", () => {
    const result = computeGroupMatchScore(baseGroup, {
      major: "Electrical Trade",
      skills: ["Wiring", "CAD"],
    });
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.reasons[0]).toContain("actively looking");
  });

  test("returns zero score without completed profile major", () => {
    const result = computeGroupMatchScore(baseGroup, null);
    expect(result.score).toBe(0);
  });
});
