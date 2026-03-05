import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM ?? "onboarding@resend.dev"

export async function sendGroupFullEmail({
  to,
  creatorName,
  groupName,
  groupUrl,
  memberCount,
}: {
  to: string
  creatorName: string
  groupName: string
  groupUrl: string
  memberCount: number
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Your GradConnect team "${groupName}" is full!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your team is full! 🎉</h2>
        <p>Hi ${creatorName},</p>
        <p>
          Great news — your GradConnect team <strong>${groupName}</strong> has reached
          its capacity of ${memberCount} members.
        </p>
        <p>
          Time to get everyone connected and start building. Log in to see your full
          team roster and share your communication platform link with everyone.
        </p>
        <a
          href="${groupUrl}"
          style="
            display: inline-block;
            background: #7c3aed;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 16px;
          "
        >
          View Your Team
        </a>
        <p style="margin-top: 32px; color: #6b7280; font-size: 14px;">
          — The GradConnect Team
        </p>
      </div>
    `,
  })
}
