import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-lavender-soft to-secondary-light" />
      
      {/* Floating orbs */}
      <div className="orb orb-primary w-64 h-64 -bottom-20 -left-20 opacity-30" />
      <div className="orb orb-secondary w-48 h-48 -top-10 -right-10 opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-soft border border-accent/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent-foreground">Start Your Journey Today</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to transform your{" "}
            <span className="text-gradient-primary">mindset</span>?
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands who are already using AI to craft powerful, personalized manifestations. 
            Your future self is waiting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/create">
              <Button variant="hero" size="xl" className="group">
                <Sparkles className="w-5 h-5" />
                Create Your First Manifestation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free to start • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}
