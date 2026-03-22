import Image from "next/image";
import { ArrowDownRight, BellRing, CalendarDays, FileText, Sparkles } from "lucide-react";
import { NotesSection } from "@/components/notes-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDocuments } from "@/lib/supabase/documents";

import collegeBanner from "@/image.jpeg";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function DocumentSection({
  id,
  title,
  items,
  icon
}: {
  id: string;
  title: string;
  items: Array<{
    id: string;
    title: string;
    description: string | null;
    public_url?: string;
  }>;
  icon: React.ReactNode;
}) {
  return (
    <section className="section glass" id={id}>
      <div className="section-header">
        <h2>{title}</h2>
      </div>

      {items.length ? (
        <div className="grid cards-2">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <div className="meta">
                {icon}
                {title}
              </div>
              <h3>{item.title}</h3>
              {item.description ? <p>{item.description}</p> : null}
              {item.public_url ? (
                <div style={{ marginTop: 18 }}>
                  <a className="button secondary" href={item.public_url} target="_blank">
                    Open
                  </a>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span>{title}</span>
        </div>
      )}
    </section>
  );
}

export default async function HomePage() {
  const [notes, syllabus, events, circulars, achievements] = await Promise.all([
    getDocuments("notes"),
    getDocuments("syllabus"),
    getDocuments("events"),
    getDocuments("circulars"),
    getDocuments("achievements")
  ]);

  return (
    <main className="page-shell">
      <header className="topbar glass">
        <nav className="nav">
          <a href="#notes">Notes</a>
          <a href="#syllabus">Syllabus</a>
          <a href="#events">Events</a>
          <a href="#circulars">Circulars</a>
          <a href="#achievements">Achievements</a>
          <a href="/login">Admin</a>
        </nav>
        <ThemeToggle />
      </header>

      <section className="landing-shell">
        <div className="banner-frame">
          <Image alt="College banner" className="banner-image" placeholder="blur" priority src={collegeBanner} />
        </div>

        <div className="landing-copy glass">
          <div className="hero-chip">
            <Sparkles size={15} />
            Physics Portal
          </div>
          <p className="landing-title">DEPARTMENT OF PHYSICS</p>
          <div className="hero-links">
            <a href="#notes">
              Notes <ArrowDownRight size={16} />
            </a>
            <a href="#syllabus">
              Syllabus <ArrowDownRight size={16} />
            </a>
            <a href="#events">
              Events <ArrowDownRight size={16} />
            </a>
            <a href="#circulars">
              Circulars <ArrowDownRight size={16} />
            </a>
            <a href="#achievements">
              Achievements <ArrowDownRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <NotesSection documents={notes} />

      <DocumentSection
        icon={<FileText size={15} />}
        id="syllabus"
        items={syllabus}
        title="Syllabus"
      />
      <DocumentSection
        icon={<CalendarDays size={15} />}
        id="events"
        items={events}
        title="Events"
      />
      <DocumentSection
        icon={<BellRing size={15} />}
        id="circulars"
        items={circulars}
        title="Circulars"
      />
      <DocumentSection
        icon={<Sparkles size={15} />}
        id="achievements"
        items={achievements}
        title="Achievements"
      />

      <footer className="footer">DEPARTMENT OF PHYSICS</footer>
    </main>
  );
}
