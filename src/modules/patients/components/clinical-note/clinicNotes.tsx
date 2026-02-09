import { FileText, Plus, User2 } from "lucide-react";
import { PatientClinicalNote } from "../../types/patient-clinical-note.type";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { formatDate } from "../../../../utils/utils";

interface PatientClinicNotesProps {
  clinicalNotesList: PatientClinicalNote[] | [];
  onEdit?: () => void;
}

export const PatientClinicNotes = ({
  clinicalNotesList,
  onEdit,
}: PatientClinicNotesProps) => {
  const [clinicalNotes, setClinicalNotes] = useState<PatientClinicalNote[]>([]);

  useEffect(() => {
    setClinicalNotes(clinicalNotesList || []);
  }, [clinicalNotesList]);

  const NoteCard = ({ note }: { note: PatientClinicalNote }) => {
    const { uuid, content, createdAt, createdBy } = note;

    return (
      <div
        key={uuid}
        className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-4"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p
              className="text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Fecha de registro: {formatDate(createdAt)}
              <span
                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-white rounded-full ml-4"
                style={{ fontSize: "13px", fontWeight: 500 }}
              >
                <User2 size={14} />
                {createdBy?.username}
              </span>
            </p>
            <p className="mt-2">{content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ fontWeight: 600 }}>Notas Clínicas</h3>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
        >
          <Plus size={18} />
          <span>Nueva Nota</span>
        </button>
      </div>

      {clinicalNotes.length > 0 ? (
        <div className="space-y-4">
          {clinicalNotes.map((note) => (
            <NoteCard key={note.uuid} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>No hay notas clínicas registradas</p>
          <button className="mt-4 px-4 py-2 text-[var(--color-primary)] hover:underline">
            Crear primera nota
          </button>
        </div>
      )}
    </div>
  );
};
