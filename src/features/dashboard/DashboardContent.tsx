"use client";

import { useState, useEffect, useCallback } from "react";
import { UploadForm } from "@/features/pdf-upload/UploadForm";
import { SummaryCard } from "@/features/summaries/SummaryCard";
import type { PdfWithSummary } from "@/features/pdf-upload/types";
import { FileText, Inbox } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function DashboardContent() {
  const [pdfs, setPdfs] = useState<PdfWithSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPdfs = useCallback(async () => {
    try {
      const res = await fetch("/api/pdfs");
      if (res.ok) {
        const data = await res.json();
        setPdfs(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPdfs();
  }, [fetchPdfs]);

  const totalDocs = pdfs.length;
  const summarized = pdfs.filter((p) => !!p.summary).length;

  return (
    <div className="space-y-8">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Dokumente gesamt</p>
          <p className="text-2xl font-bold mt-1">{totalDocs}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs text-muted-foreground">Zusammengefasst</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{summarized}</p>
        </div>
        <div className="rounded-lg border bg-card p-4 col-span-2 sm:col-span-1">
          <p className="text-xs text-muted-foreground">Ausstehend</p>
          <p className="text-2xl font-bold mt-1 text-amber-600">{totalDocs - summarized}</p>
        </div>
      </div>

      {/* Upload Section */}
      <section>
        <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Neues Dokument hochladen
        </h2>
        <UploadForm onUploadSuccess={fetchPdfs} />
      </section>

      <Separator />

      {/* Documents List */}
      <section>
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <Inbox className="h-4 w-4 text-primary" />
          Hochgeladene Dokumente
          {totalDocs > 0 && (
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {totalDocs} {totalDocs === 1 ? "Dokument" : "Dokumente"}
            </span>
          )}
        </h2>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 rounded-lg border bg-muted animate-pulse" />
            ))}
          </div>
        ) : pdfs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border rounded-lg bg-muted/30">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Noch keine Dokumente hochgeladen</p>
            <p className="text-xs mt-1">Laden Sie oben Ihr erstes PDF hoch.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {pdfs.map((pdf) => (
              <SummaryCard key={pdf.id} pdf={pdf} onRefresh={fetchPdfs} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

