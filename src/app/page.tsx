import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/homepage/HeroSection"
import { StatsSection } from "@/components/homepage/StatsSection"
import { HowItWorksSection } from "@/components/homepage/HowItWorksSection"
import { WhyTeamSection } from "@/components/homepage/WhyTeamSection"
import { FinalCTA } from "@/components/homepage/FinalCTA"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <WhyTeamSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
