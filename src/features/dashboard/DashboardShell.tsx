"use client";

import { useRouter } from "next/navigation";
import { Building2, LogOut, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DashboardShellProps {
  municipalityName: string;
  municipalitySlug: string;
  children: React.ReactNode;
}

export function DashboardShell({
  municipalityName,
  municipalitySlug,
  children,
}: DashboardShellProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-bold text-sm text-foreground">CiviBrief</span>
              <span className="text-muted-foreground text-sm"> · </span>
              <span className="text-sm text-muted-foreground">{municipalityName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1">
              <Building2 className="h-3 w-3" />
              {municipalitySlug}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="h-4 w-4 mr-1.5" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} CiviBrief</span>
          <span>Stadt Lauterbach · MVP</span>
        </div>
      </footer>
    </div>
  );
}

