import { fallbackDocuments } from "@/lib/content";
import type { DocumentRecord, SectionType } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDocuments(category?: SectionType) {
  const client = await createSupabaseServerClient();

  if (!client) {
    return category
      ? fallbackDocuments.filter((item) => item.category === category)
      : fallbackDocuments;
  }

  const query = client
    .from("documents")
    .select("id, title, description, category, semester, file_path, created_at")
    .order("created_at", { ascending: false });

  const { data, error } = category ? await query.eq("category", category) : await query;

  if (error || !data) {
    return category
      ? fallbackDocuments.filter((item) => item.category === category)
      : fallbackDocuments;
  }

  return data.map((item) => ({
    ...item,
    public_url: buildPublicUrl(item.file_path)
  })) as DocumentRecord[];
}

function buildPublicUrl(filePath: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    return "#";
  }

  return `${url}/storage/v1/object/public/department-files/${filePath}`;
}
