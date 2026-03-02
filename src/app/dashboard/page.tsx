import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/features/dashboard/DashboardContent";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.municipalityId) {
    redirect("/login");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">
          Willkommen, {session.municipalityName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verwalten Sie Ihre Dokumente und KI-Zusammenfassungen.
        </p>
      </div>
      <DashboardContent />
    </div>
  );
}

