import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Shield, Building2 } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Civi<span className="text-primary">Brief</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Kommunales Dokumentenmanagement mit KI-gestützter Zusammenfassung.
          Für Lauterbach und weitere Kommunen.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/login">Jetzt anmelden</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "PDF-Upload",
              desc: "Laden Sie Ihre Dokumente sicher hoch – nur für Ihre Kommune sichtbar.",
            },
            {
              icon: Sparkles,
              title: "KI-Zusammenfassung",
              desc: "Automatische Zusammenfassungen mit modernster KI-Technologie.",
            },
            {
              icon: Shield,
              title: "Datenschutz",
              desc: "Jede Kommune sieht ausschließlich ihre eigenen Dokumente.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-card p-6 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mb-4">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Building2 className="h-3.5 w-3.5" />
          <span>Stadt Lauterbach</span>
        </div>
        <span>© {new Date().getFullYear()} CiviBrief · MVP</span>
      </footer>
    </main>
  );
}

