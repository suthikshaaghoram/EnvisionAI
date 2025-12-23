import { Sparkles, Brain, Wand2, Stars } from "lucide-react";

const steps = [
  { icon: Brain, text: "Analyzing your goals and strengths..." },
  { icon: Wand2, text: "Crafting personalized affirmations..." },
  { icon: Stars, text: "Adding manifestation power..." },
  { icon: Sparkles, text: "Finalizing your vision..." },
];

export function GeneratingState() {
  return (
    <div className="w-full max-w-md mx-auto text-center py-16 animate-fade-in">
      {/* Animated orb */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-lavender opacity-20 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary to-lavender opacity-40 animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary to-lavender opacity-60 animate-pulse" style={{ animationDelay: "0.4s" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-12 h-12 text-primary animate-float" />
        </div>
      </div>

      <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
        Creating Your Manifestation
      </h2>
      <p className="text-muted-foreground mb-8">
        Our AI is crafting something special for you...
      </p>

      {/* Progress steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl bg-card shadow-card animate-fade-in-up opacity-0"
            style={{ animationDelay: `${index * 600}ms`, animationFillMode: "forwards" }}
          >
            <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
