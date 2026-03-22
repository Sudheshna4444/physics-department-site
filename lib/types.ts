export type SectionType = "notes" | "syllabus" | "events" | "circulars" | "achievements";

export type Semester =
  | "Sem 1"
  | "Sem 2"
  | "Sem 3"
  | "Sem 4"
  | "Sem 5"
  | "Sem 6";

export type DocumentRecord = {
  id: string;
  title: string;
  description: string | null;
  category: SectionType;
  semester: Semester | null;
  file_path: string;
  public_url?: string;
  created_at: string;
};
