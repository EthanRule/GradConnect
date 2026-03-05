export type AnalyticsEventName =
  | "sign_up"
  | "profile_completed"
  | "team_created"
  | "team_joined"
  | "idea_posted"
  | "report_submitted";

function logAnalytics(payload: {
  event: AnalyticsEventName;
  userId: string | null;
  properties: Record<string, unknown>;
}) {
  console.info(
    "[analytics]",
    JSON.stringify({
      ...payload,
      at: new Date().toISOString(),
    }),
  );
}

export function trackServerEvent(
  event: AnalyticsEventName,
  userId: string | null,
  properties: Record<string, unknown> = {},
) {
  logAnalytics({
    event,
    userId,
    properties,
  });
}

export function trackEventForUser(
  userId: string | null,
  event: AnalyticsEventName,
  properties: Record<string, unknown> = {},
) {
  logAnalytics({ event, userId, properties });
}

export async function trackClientEvent(
  event: AnalyticsEventName,
  properties: Record<string, unknown> = {},
) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, properties }),
    });
  } catch {
    // No-op: analytics failures should never block product actions.
  }
}
