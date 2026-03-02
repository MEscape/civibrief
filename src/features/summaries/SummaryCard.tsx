"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {FileText, Loader2, Sparkles, Copy, Check, Trash2, ExternalLink} from "lucide-react";
import type { PdfWithSummary } from "../pdf-upload/types";

interface SummaryCardProps {
  pdf: PdfWithSummary;
  onRefresh?: () => void;
}

export function SummaryCard({ pdf, onRefresh }: SummaryCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hasSummary = !!pdf.summary;

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pdfs/${pdf.id}/summarize`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Zusammenfassung fehlgeschlagen.");
      } else {
        onRefresh?.();
      }
    } catch {
      setError("Netzwerkfehler.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!pdf.summary) return;
    await navigator.clipboard.writeText(pdf.summary.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!confirm(`"${pdf.original_name}" wirklich löschen?`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/pdfs/${pdf.id}`, { method: "DELETE" });
      if (res.ok) onRefresh?.();
    } finally {
      setDeleting(false);
    }
  };

  const uploadDate = new Date(pdf.uploaded_at).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Card className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <CardTitle className="text-sm font-semibold truncate" title={pdf.original_name}>
              {pdf.original_name}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {hasSummary ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                Zusammengefasst
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                Ausstehend
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary"
              title="PDF in neuem Tab öffnen"
              onClick={() => window.open(`/api/pdfs/${pdf.id}/file`, "_blank")}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Hochgeladen am {uploadDate}</p>
      </CardHeader>

      {hasSummary && (
        <>
          <Separator />
          <CardContent className="pt-3">
            <div className="relative">
              <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                {pdf.summary!.content}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-7 w-7"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
            {pdf.summary?.created_at && (
              <p className="text-xs text-muted-foreground/60 mt-2">
                Modell: {pdf.summary.model} ·{" "}
                {new Date(pdf.summary.created_at).toLocaleDateString("de-DE")}
              </p>
            )}
          </CardContent>
        </>
      )}

      {!hasSummary && (
        <CardContent className="pt-0">
          {error && <p className="text-xs text-destructive mb-2">{error}</p>}
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Generiere Zusammenfassung…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                Zusammenfassung erstellen
              </>
            )}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

