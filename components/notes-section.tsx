"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { semesters } from "@/lib/content";
import type { DocumentRecord, Semester } from "@/lib/types";

type NotesSectionProps = {
  documents: DocumentRecord[];
};

export function NotesSection({ documents }: NotesSectionProps) {
  const [selectedSemester, setSelectedSemester] = useState<Semester>("Sem 1");

  const filteredNotes = useMemo(
    () => documents.filter((item) => item.semester === selectedSemester),
    [documents, selectedSemester]
  );

  return (
    <section className="section glass" id="notes">
      <div className="section-header">
        <div>
          <h2>Notes</h2>
        </div>
        <p>Semester-wise material.</p>
      </div>

      <div className="document-toolbar">
        <select
          aria-label="Choose semester"
          className="select"
          value={selectedSemester}
          onChange={(event) => setSelectedSemester(event.target.value as Semester)}
        >
          {semesters.map((semester) => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>

      <div className="document-list">
        {filteredNotes.length ? (
          filteredNotes.map((item) => (
            <article className="document-item" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.description ?? "Department note"}</span>
              </div>
              <a className="button secondary" href={item.public_url ?? "#"} target="_blank">
                Open <ChevronRight size={16} />
              </a>
            </article>
          ))
        ) : (
          <div className="status">No notes uploaded yet for {selectedSemester}.</div>
        )}
      </div>
    </section>
  );
}
