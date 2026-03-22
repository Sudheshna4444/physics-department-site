import { redirect } from "next/navigation";
import { AdminPanel } from "@/components/admin-panel";
import { getDocuments } from "@/lib/supabase/documents";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const client = await createSupabaseServerClient();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

  if (!client) {
    redirect("/login");
  }

  const {
    data: { user }
  } = await client.auth.getUser();

  if (!user || user.email !== adminEmail) {
    redirect("/login");
  }

  const documents = await getDocuments();

  return <AdminPanel initialDocuments={documents} />;
}
