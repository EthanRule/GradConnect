import { UserCircle, Users, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserCircle,
    title: "Build your profile",
    description:
      "Share your field or trade, skills, and what you want to build. Link your GitHub, LinkedIn, or portfolio so teammates know what you bring to the table.",
  },
  {
    number: "02",
    icon: Users,
    title: "Find or create a team",
    description:
      "Browse open teams looking for your skill set, or post your own idea and invite people from different fields and trades. Max 5 per field/trade keeps teams balanced and diverse.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Vote and ship",
    description:
      "Your team proposes project ideas and votes on the best one. Connect on Discord, Slack, or Teams — then start building. The AI does the heavy lifting. You provide the direction.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-zinc-950 py-24 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-amber-400">
            Simple by design
          </p>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            From grad to founder in three steps
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            No experience required. No funding needed to start. Just a team, an
            idea, and AI as your co-pilot.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-600/10">
                  <step.icon className="h-10 w-10 text-amber-400" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-xs font-bold text-white">
                    {step.number.replace("0", "")}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

