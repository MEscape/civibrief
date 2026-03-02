import { redirect } from "next/navigation";
import { getSession } from "@/features/auth/session";
import { DashboardShell } from "@/features/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.municipalityId) {
    redirect("/login");
  }

  return (
    <DashboardShell
      municipalityName={session.municipalityName ?? "Kommune"}
      municipalitySlug={session.municipalitySlug ?? ""}
    >
      {children}
    </DashboardShell>
  );
}

