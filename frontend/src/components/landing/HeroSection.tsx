import { Button } from "@/components/ui/button";
import { Sparkles, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Floating orbs for extra depth */}
      <div className="orb orb-primary w-96 h-96 -top-20 -right-20 opacity-30" />
      <div className="orb orb-secondary w-72 h-72 top-1/3 -left-20 opacity-30" style={{ animationDelay: '-5s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-primary/20 mb-8 animate-fade-in-up opacity-0">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Manifestation</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 animate-fade-in-up opacity-0 delay-100 leading-tight">
            Envision your future.
            <br />
            <span className="text-gradient-primary">Let AI guide your manifestation.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up opacity-0 delay-200 leading-relaxed">
            Transform your goals into powerful, personalized affirmations. 
            Our AI crafts manifestation passages tailored to your unique journey, 
            helping you visualize and achieve your dreams.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0 delay-300">
            <Link to="/create">
              <Button variant="hero" size="xl">
                <Sparkles className="w-5 h-5" />
                Generate My Manifestation
              </Button>
            </Link>
            <Button variant="glass" size="xl">
              <Play className="w-5 h-5" />
              Explore Features
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-16 animate-fade-in-up opacity-0 delay-400">
            <TrustBadge icon="🔒" text="Privacy-First" />
            <TrustBadge icon="🤖" text="AI-Powered" />
            <TrustBadge icon="✨" text="Free to Start" />
            <TrustBadge icon="🎯" text="Personalized" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm shadow-card border border-border/50">
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium text-muted-foreground">{text}</span>
    </div>
  );
}
