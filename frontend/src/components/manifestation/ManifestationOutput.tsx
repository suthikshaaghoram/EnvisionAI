import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Volume2,
  Save,
  RefreshCw,
  Share2,
  Download,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ManifestationOutputProps {
  manifestation: string;
  audioPath?: string | null;
  onRegenerate: () => void;
  onSave: () => void;
  isRegenerating: boolean;
}

export function ManifestationOutput({
  manifestation,
  audioPath,
  onRegenerate,
  onSave,
  isRegenerating,
}: ManifestationOutputProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const [audio] = useState(new Audio(audioPath ? `/api${audioPath}` : undefined));

  const handlePlayAudio = () => {
    if (!audioPath) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    }
  };

  // Note: Simple audio handling. For production, use a more robust hook or player.

  const handleCopy = async () => {
    await navigator.clipboard.writeText(manifestation);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "Manifestation copied to clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    onSave();
    setIsSaved(true);
    toast({
      title: "Saved!",
      description: "Your manifestation has been saved.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Manifestation",
        text: manifestation,
      });
    } else {
      handleCopy();
    }
  };

  // Highlight affirmations (sentences starting with "I am", "I have", etc.)
  const highlightedText = manifestation.split(/(?<=[.!?])\s+/).map((sentence, index) => {
    const isAffirmation = /^(I am|I have|I will|I can|I choose|I embrace|I attract|I deserve)/i.test(sentence.trim());
    return (
      <span
        key={index}
        className={cn(
          "transition-colors",
          isAffirmation && "text-primary font-medium"
        )}
      >
        {sentence}{" "}
      </span>
    );
  });

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-primary w-96 h-96 top-1/4 -right-48 opacity-20" />
        <div className="orb orb-secondary w-64 h-64 bottom-1/4 -left-32 opacity-20" />
      </div>

      {/* Success header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/10 mb-4">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">
            Your manifestation is ready
          </span>
        </div>
        <h2 className="font-display text-3xl font-bold text-foreground">
          Embrace Your Vision
        </h2>
      </div>

      {/* Manifestation card */}
      <Card variant="elevated" className="relative z-10 overflow-hidden">
        {/* Decorative gradient border */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-lavender/5 pointer-events-none" />

        <CardContent className="p-8 md:p-10">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed text-lg whitespace-pre-line">
              {highlightedText}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-8 relative z-10">
        {audioPath && (
          <Button variant="soft" size="lg" onClick={handlePlayAudio}>
            <Volume2 className={cn("w-4 h-4", isPlaying && "animate-pulse text-primary")} />
            {isPlaying ? "Pause Voice" : "Play Voice"}
          </Button>
        )}

        <Button
          variant={isSaved ? "default" : "soft"}
          size="lg"
          onClick={handleSave}
          disabled={isSaved}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save
            </>
          )}
        </Button>

        <Button
          variant="soft"
          size="lg"
          onClick={onRegenerate}
          disabled={isRegenerating}
        >
          <RefreshCw className={cn("w-4 h-4", isRegenerating && "animate-spin")} />
          Regenerate
        </Button>

        <Button variant="soft" size="lg" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          Share
        </Button>

        <Button variant="soft" size="lg" onClick={handleCopy}>
          {isCopied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Info text */}
      <p className="text-center text-sm text-muted-foreground mt-6 relative z-10">
        💡 <span className="font-medium text-primary">Highlighted sentences</span> are your key affirmations.
        Read them aloud daily for maximum impact.
      </p>
    </div>
  );
}
