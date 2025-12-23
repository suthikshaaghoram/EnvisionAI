import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Mic, History, Search, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Our advanced AI creates personalized manifestation passages based on your unique goals, strengths, and mindset.",
    color: "primary",
  },
  {
    icon: Mic,
    title: "Voice Conversion",
    description: "Transform your written manifestations into soothing audio with Indian English or Tamil accent options.",
    color: "secondary",
  },
  {
    icon: History,
    title: "Manifestation History",
    description: "Save and revisit your past manifestations. Track your growth and evolution over time.",
    color: "lavender",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Find any manifestation using natural language. Our AI understands context and meaning.",
    color: "accent",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    description: "Your manifestations are personal. We use industry-standard encryption to keep them safe.",
    color: "primary",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get your personalized manifestation in seconds. No waiting, no complexity.",
    color: "secondary",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary-light",
    text: "text-primary",
    icon: "bg-primary/10",
  },
  secondary: {
    bg: "bg-secondary-light",
    text: "text-secondary",
    icon: "bg-secondary/10",
  },
  lavender: {
    bg: "bg-lavender-soft",
    text: "text-lavender",
    icon: "bg-lavender/10",
  },
  accent: {
    bg: "bg-accent-soft",
    text: "text-accent",
    icon: "bg-accent/10",
  },
};

export function FeaturesSection() {
  return (
    <section className="py-24 bg-calm-gradient relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need to{" "}
            <span className="text-gradient-primary">manifest</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete toolkit designed to help you visualize, affirm, and achieve your dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <Card
                key={feature.title}
                variant="glass"
                className="group hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl ${colors.icon} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
