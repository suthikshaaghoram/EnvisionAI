import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-lavender flex items-center justify-center shadow-soft group-hover:shadow-elevated transition-shadow duration-300">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-semibold text-xl text-foreground">
            Envision<span className="text-gradient-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link
            to="/create"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Create
          </Link>
          <Link
            to="/history"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            History
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {isHome ? (
            <Link to="/create">
              <Button variant="hero" size="default">
                <Sparkles className="w-4 h-4" />
                Get Started
              </Button>
            </Link>
          ) : (
            <Link to="/create">
              <Button variant="soft" size="default">
                <Sparkles className="w-4 h-4" />
                New Manifestation
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
