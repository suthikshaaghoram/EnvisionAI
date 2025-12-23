import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Sparkles, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SavedManifestation {
  id: number;
  content: string;
  createdAt: string;
  formData: {
    lifeGoals: string;
    strengths: string;
    challenges: string;
    desiredMindset: string;
  };
}

const History = () => {
  const [manifestations, setManifestations] = useState<SavedManifestation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("manifestations") || "[]");
    setManifestations(saved.reverse()); // Most recent first
  }, []);

  const filteredManifestations = manifestations.filter(
    (m) =>
      m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.formData.lifeGoals.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    const updated = manifestations.filter((m) => m.id !== id);
    setManifestations(updated);
    localStorage.setItem("manifestations", JSON.stringify(updated.reverse()));
    if (selectedId === id) setSelectedId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const selectedManifestation = manifestations.find((m) => m.id === selectedId);

  return (
    <div className="min-h-screen bg-calm-gradient">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Your Manifestation History
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Revisit your past manifestations and track your growth journey.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search your manifestations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl bg-card border-border/50 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {manifestations.length === 0 ? (
            /* Empty state */
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-light flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                No manifestations yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Create your first manifestation to see it here.
              </p>
              <Button variant="hero" asChild>
                <a href="/create">
                  <Sparkles className="w-4 h-4" />
                  Create Your First
                </a>
              </Button>
            </div>
          ) : (
            /* Content grid */
            <div className="grid lg:grid-cols-2 gap-6">
              {/* List */}
              <div className="space-y-4">
                {filteredManifestations.map((manifestation) => (
                  <Card
                    key={manifestation.id}
                    variant="glass"
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-elevated",
                      selectedId === manifestation.id && "ring-2 ring-primary shadow-glow"
                    )}
                    onClick={() => setSelectedId(manifestation.id)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(manifestation.createdAt)}
                          </div>
                          <p className="text-foreground line-clamp-3 leading-relaxed">
                            {manifestation.content.slice(0, 150)}...
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="px-2 py-1 text-xs rounded-full bg-primary-light text-primary">
                              {manifestation.formData.lifeGoals.split(" ").slice(0, 3).join(" ")}...
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(manifestation.id);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(manifestation.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Preview */}
              <div className="lg:sticky lg:top-24 lg:h-fit">
                {selectedManifestation ? (
                  <Card variant="elevated" className="animate-scale-in">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedManifestation.createdAt)}
                      </div>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-foreground leading-relaxed whitespace-pre-line">
                          {selectedManifestation.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card variant="glass" className="text-center py-16">
                    <CardContent>
                      <Eye className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select a manifestation to preview
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default History;
