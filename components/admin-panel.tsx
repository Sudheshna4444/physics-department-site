"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, Upload } from "lucide-react";
import { sectionLabels, semesters } from "@/lib/content";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { DocumentRecord, SectionType, Semester } from "@/lib/types";

type AdminPanelProps = {
  initialDocuments: DocumentRecord[];
};

type FormState = {
  title: string;
  description: string;
  category: SectionType;
  semester: Semester | "";
  file: File | null;
};

const initialState: FormState = {
  title: "",
  description: "",
  category: "notes",
  semester: "Sem 1",
  file: null
};

export function AdminPanel({ initialDocuments }: AdminPanelProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState(initialDocuments);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Ready to upload.");
  const [error, setError] = useState("");

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (!formState.file) {
        throw new Error("Select a document before uploading.");
      }

      const client = createSupabaseBrowserClient();
      const timestamp = Date.now();
      const safeName = formState.file.name.replace(/\s+/g, "-").toLowerCase();
      const filePath = `${formState.category}/${timestamp}-${safeName}`;

      const { error: uploadError } = await client.storage
        .from("department-files")
        .upload(filePath, formState.file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: inserted, error: insertError } = await client
        .from("documents")
        .insert({
          title: formState.title,
          description: formState.description || null,
          category: formState.category,
          semester: formState.category === "notes" ? formState.semester : null,
          file_path: filePath
        })
        .select("id, title, description, category, semester, file_path, created_at")
        .single();

      if (insertError || !inserted) {
        throw insertError ?? new Error("Could not save document metadata.");
      }

      const { data: publicUrlData } = client.storage.from("department-files").getPublicUrl(filePath);

      setDocuments([{ ...inserted, public_url: publicUrlData.publicUrl }, ...documents]);
      setFormState(initialState);
      setMessage("Document uploaded and published successfully.");
      router.refresh();
    } catch (uploadIssue) {
      const detail = uploadIssue instanceof Error ? uploadIssue.message : "Upload failed.";
      setError(detail);
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    const client = createSupabaseBrowserClient();
    await client.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handleDelete(document: DocumentRecord) {
    const confirmed = window.confirm(`Delete "${document.title}"?`);

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const client = createSupabaseBrowserClient();

      const { error: storageError } = await client.storage
        .from("department-files")
        .remove([document.file_path]);

      if (storageError) {
        throw storageError;
      }

      const { error: deleteError } = await client.from("documents").delete().eq("id", document.id);

      if (deleteError) {
        throw deleteError;
      }

      setDocuments((current) => current.filter((item) => item.id !== document.id));
      setMessage("Document deleted successfully.");
      router.refresh();
    } catch (deleteIssue) {
      const detail = deleteIssue instanceof Error ? deleteIssue.message : "Delete failed.";
      setError(detail);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-shell admin-shell-warm glass">
      <div className="section-header">
        <div>
          <h2>Manage Physics Department Content</h2>
        </div>
      </div>

      <div className="admin-grid">
        <section className="card admin-card admin-card-warm">
          <h3>Upload a New Document</h3>

          <form className="form-grid" onSubmit={handleUpload}>
            <input
              className="input"
              placeholder="Document title"
              required
              value={formState.title}
              onChange={(event) =>
                setFormState((state) => ({ ...state, title: event.target.value }))
              }
            />

            <textarea
              className="textarea"
              placeholder="Short description"
              value={formState.description}
              onChange={(event) =>
                setFormState((state) => ({ ...state, description: event.target.value }))
              }
            />

            <select
              className="select"
              value={formState.category}
              onChange={(event) =>
                setFormState((state) => ({
                  ...state,
                  category: event.target.value as SectionType,
                  semester: event.target.value === "notes" ? state.semester || "Sem 1" : ""
                }))
              }
            >
              {Object.entries(sectionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {formState.category === "notes" ? (
              <select
                className="select"
                value={formState.semester}
                onChange={(event) =>
                  setFormState((state) => ({ ...state, semester: event.target.value as Semester }))
                }
              >
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            ) : null}

            <input
              className="input"
              type="file"
              required
              onChange={(event) =>
                setFormState((state) => ({ ...state, file: event.target.files?.[0] ?? null }))
              }
            />

            <button className="button primary" disabled={busy} type="submit">
              <Upload size={16} />
              {busy ? "Uploading..." : "Upload Document"}
            </button>
          </form>

          {error ? <div className="status error" style={{ marginTop: 16 }}>{error}</div> : null}
          {!error ? <div className="status" style={{ marginTop: 16 }}>{message}</div> : null}
        </section>

        <section className="card admin-card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <h3 style={{ margin: 0 }}>Latest Uploaded Items</h3>
            <button className="button secondary" onClick={handleLogout} type="button">
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <div className="document-list">
            {documents.length ? (
              documents.slice(0, 6).map((item) => (
                <article className="document-item" key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>
                      {sectionLabels[item.category]}
                      {item.semester ? ` • ${item.semester}` : ""}
                    </span>
                  </div>
                  <div className="document-actions">
                    <a className="button secondary" href={item.public_url ?? "#"} target="_blank">
                      View
                    </a>
                    <button
                      className="button secondary"
                      disabled={busy}
                      onClick={() => handleDelete(item)}
                      type="button"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="status">No documents available yet.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
