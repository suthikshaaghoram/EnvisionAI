import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepIndicator } from "./StepIndicator";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FormData {
  // Personal Details
  name: string;
  birthDate: string;
  nakshatra: string;
  birthTime: string;
  birthPlace: string;
  lagna: string;
  // Personal Growth
  strengths: string;
  areasOfImprovement: string;
  greatestAchievement: string;
  lastYearAchievement: string;
  nextYearGoals: string;
  lifeGoals: string;
  howToBeRemembered: string;
  manifestationWish: string;
}

interface ManifestationFormProps {
  onComplete: (data: FormData) => void;
  isGenerating: boolean;
}

const steps = ["Personal Info", "Birth Details", "Achievements", "Goals & Vision"];

type StepField = {
  key: keyof FormData;
  label: string;
  type: "text" | "textarea" | "date" | "time";
  placeholder: string;
  required?: boolean;
};

const stepFields: Record<number, StepField[]> = {
  1: [
    {
      key: "name",
      label: "What would you like to be called?",
      type: "text",
      placeholder: "Enter your preferred name",
      required: true,
    },
    {
      key: "birthDate",
      label: "Birth Date",
      type: "date",
      placeholder: "Select your birth date",
      required: true,
    },
    {
      key: "birthTime",
      label: "Birth Time",
      type: "time",
      placeholder: "Enter your birth time",
    },
  ],
  2: [
    {
      key: "birthPlace",
      label: "Birth Place",
      type: "text",
      placeholder: "e.g., Chennai, Tamil Nadu, India",
    },
    {
      key: "nakshatra",
      label: "Nakshatra (with Padam)",
      type: "text",
      placeholder: "e.g., Ashwini Padam 1",
    },
    {
      key: "lagna",
      label: "Lagna (Ascendant)",
      type: "text",
      placeholder: "e.g., Mesha (Aries)",
    },
  ],
  3: [
    {
      key: "strengths",
      label: "Your Strengths",
      type: "textarea",
      placeholder: "What are you naturally good at? What do others appreciate about you?",
      required: true,
    },
    {
      key: "areasOfImprovement",
      label: "Areas of Improvement",
      type: "textarea",
      placeholder: "What aspects of yourself would you like to develop further?",
    },
    {
      key: "greatestAchievement",
      label: "Greatest Achievement in Life",
      type: "textarea",
      placeholder: "What accomplishment are you most proud of?",
    },
    {
      key: "lastYearAchievement",
      label: "Big Achievement in the Last Year",
      type: "textarea",
      placeholder: "What significant milestone did you reach recently?",
    },
  ],
  4: [
    {
      key: "nextYearGoals",
      label: "Next One Year Goals",
      type: "textarea",
      placeholder: "What do you want to achieve in the next 12 months?",
      required: true,
    },
    {
      key: "lifeGoals",
      label: "Life Goals (with Timeline)",
      type: "textarea",
      placeholder: "e.g., By 30: Start my own business. By 40: Achieve financial freedom...",
      required: true,
    },
    {
      key: "howToBeRemembered",
      label: "How would you like others to remember you?",
      type: "textarea",
      placeholder: "What legacy do you want to leave behind?",
    },
    {
      key: "manifestationWish",
      label: "One Thing You Want to Manifest",
      type: "textarea",
      placeholder: "If you could manifest just one thing right now, what would it be?",
      required: true,
    },
  ],
};

const initialFormData: FormData = {
  name: "",
  birthDate: "",
  nakshatra: "",
  birthTime: "",
  birthPlace: "",
  lagna: "",
  strengths: "",
  areasOfImprovement: "",
  greatestAchievement: "",
  lastYearAchievement: "",
  nextYearGoals: "",
  lifeGoals: "",
  howToBeRemembered: "",
  manifestationWish: "",
};

export function ManifestationForm({ onComplete, isGenerating }: ManifestationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const currentFields = stepFields[currentStep];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 4;

  // Check if required fields in current step are filled
  const canProceed = currentFields
    .filter((f) => f.required)
    .every((f) => {
      const value = formData[f.key];
      return value && value.trim().length >= 2;
    });

  const handleNext = () => {
    if (isLastStep) {
      onComplete(formData);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator currentStep={currentStep} totalSteps={4} steps={steps} />

      <Card variant="elevated" className="animate-scale-in">
        <CardContent className="p-6 md:p-8">
          <div className="space-y-6">
            {currentFields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-sm font-medium text-foreground">
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    value={formData[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="min-h-[100px] resize-none text-base leading-relaxed focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    value={formData[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="h-12 text-base focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isFirstStep}
              className={cn(isFirstStep && "invisible")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <p className="text-sm text-muted-foreground">
              Step {currentStep} of 4
            </p>

            <Button
              variant={isLastStep ? "hero" : "default"}
              onClick={handleNext}
              disabled={!canProceed || isGenerating}
              className="min-w-[140px]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : isLastStep ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips based on current step */}
      <div className="mt-6 p-4 rounded-xl bg-primary-light/50 border border-primary/10">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-primary">💡 Tip:</span>{" "}
          {currentStep === 1 && "Your name and birth details help personalize your manifestation."}
          {currentStep === 2 && "Astrological details are optional but can add depth to your passage."}
          {currentStep === 3 && "Reflecting on your achievements builds confidence and clarity."}
          {currentStep === 4 && "Be specific about your goals. The clearer your vision, the more powerful your manifestation."}
        </p>
      </div>
    </div>
  );
}
