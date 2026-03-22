import type { DocumentRecord, SectionType, Semester } from "@/lib/types";

export const semesters: Semester[] = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];

export const sectionLabels: Record<SectionType, string> = {
  notes: "Notes",
  syllabus: "Syllabus",
  events: "Events",
  circulars: "Circulars",
  achievements: "Achievements"
};

export const fallbackDocuments: DocumentRecord[] = [];
