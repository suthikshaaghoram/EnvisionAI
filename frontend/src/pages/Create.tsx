import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/landing/Footer";
import { ManifestationForm, FormData } from "@/components/manifestation/ManifestationForm";
import { ManifestationOutput } from "@/components/manifestation/ManifestationOutput";
import { GeneratingState } from "@/components/manifestation/GeneratingState";

// API Interface
interface ManifestationResponse {
  manifestation_text: string;
  audio_path: string | null;
  qdrant_point_id: string | null;
  message: string;
}

const generateManifestation = async (data: FormData): Promise<ManifestationResponse> => {
  const payload = {
    preferred_name: data.name,
    birth_date: data.birthDate,
    nakshatra: data.nakshatra,
    birth_time: data.birthTime,
    birth_place: data.birthPlace,
    lagna: data.lagna,
    // star_sign: null, // Optional, can be omitted or sent as null
    strengths: data.strengths,
    areas_of_improvement: data.areasOfImprovement,
    greatest_achievement: data.greatestAchievement,
    recent_achievement: data.lastYearAchievement,
    next_year_goals: data.nextYearGoals,
    life_goals: data.lifeGoals,
    legacy: data.howToBeRemembered,
    manifestation_focus: data.manifestationWish,
  };

  const response = await fetch("/api/generate-manifestation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate manifestation");
  }

  return response.json();
};

const Create = () => {
  const [stage, setStage] = useState<"form" | "generating" | "output">("form");
  const [manifestation, setManifestation] = useState("");
  const [audioPath, setAudioPath] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormComplete = async (data: FormData) => {
    setFormData(data);
    setStage("generating");

    try {
      const result = await generateManifestation(data);
      setManifestation(result.manifestation_text);
      setAudioPath(result.audio_path);
      setStage("output");
    } catch (error) {
      console.error("Error generating manifestation:", error);
      setStage("form");
    }
  };

  const handleRegenerate = async () => {
    if (!formData) return;
    setStage("generating");

    try {
      const result = await generateManifestation(formData);
      setManifestation(result.manifestation_text);
      setAudioPath(result.audio_path);
      setStage("output");
    } catch (error) {
      console.error("Error regenerating manifestation:", error);
    }
  };

  const handleSave = () => {
    // In production, this would save to a database
    const saved = JSON.parse(localStorage.getItem("manifestations") || "[]");
    saved.push({
      id: Date.now(),
      content: manifestation,
      audioPath, // Save audio path too
      createdAt: new Date().toISOString(),
      formData,
    });
    localStorage.setItem("manifestations", JSON.stringify(saved));
  };

  return (
    <div className="min-h-screen bg-calm-gradient">
      <Header />
      <main className="pt-24 pb-16 px-4 relative">
        {/* Background orbs */}
        <div className="orb orb-primary w-80 h-80 -top-20 -right-20 fixed pointer-events-none" />
        <div className="orb orb-secondary w-64 h-64 top-1/2 -left-32 fixed pointer-events-none" />

        <div className="container mx-auto max-w-4xl relative z-10">
          {stage === "form" && (
            <div className="animate-fade-in">
              <div className="text-center mb-10">
                <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                  Create Your Manifestation
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Share your journey, goals, and aspirations. Our AI will craft a
                  personalized manifestation passage just for you.
                </p>
              </div>
              <ManifestationForm
                onComplete={handleFormComplete}
                isGenerating={false}
              />
            </div>
          )}

          {stage === "generating" && <GeneratingState />}

          {stage === "output" && (
            <ManifestationOutput
              manifestation={manifestation}
              audioPath={audioPath}
              onRegenerate={handleRegenerate}
              onSave={handleSave}
              isRegenerating={false}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
