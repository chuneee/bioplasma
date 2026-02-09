import { ImageIcon, Plus, User2 } from "lucide-react";
import { PatientPhotos } from "../../types/patient-photo.type";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { API_BASE_URL } from "../../../../shared/api/axios";
import { formatDate } from "../../../../utils/utils";

interface PatientGaleryPhotosProps {
  photosList: PatientPhotos[] | [];
  onAddPhoto: () => void;
}

export const PatientGaleryPhotos = ({
  photosList,
  onAddPhoto,
}: PatientGaleryPhotosProps) => {
  const [photos, setPhotos] = useState<PatientPhotos[]>([]);

  useEffect(() => {
    setPhotos(photosList || []);
  }, [photosList]);

  const PhotoCard = ({ photos }: { photos: PatientPhotos }) => {
    const { id, urls, createdAt, uploadedBy, description } = photos;

    return (
      <div
        key={id}
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
                {uploadedBy?.username}
              </span>
            </p>

            <div className="flex items-start justify-between">
              <div className="flex-2 flex-wrap mt-4 flex">
                {urls[0] ? (
                  <img
                    src={`${API_BASE_URL}/${urls[0]}`} // Asegúrate de que la URL sea correcta
                    alt={`Foto 1`}
                    className="w-32 h-32 object-cover rounded-lg mr-2 mb-2"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mr-2 mb-2">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <h5 className="flex-1 mb-1" style={{ fontWeight: 600 }}>
                {description}
              </h5>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ fontWeight: 600 }}>Galería de Fotos</h3>
        <button
          onClick={onAddPhoto}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
        >
          <Plus size={18} />
          <span>Subir Fotos</span>
        </button>
      </div>
      {photos.length > 0 ? (
        photos.map((photo) => <PhotoCard key={photo.id} photos={photo} />)
      ) : (
        <div className="text-center py-16 text-[var(--color-text-secondary)]">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>No hay fotos registradas para este paciente</p>
          <button className="mt-4 px-4 py-2 text-[var(--color-primary)] hover:underline">
            Subir primera foto
          </button>
        </div>
      )}
    </div>
  );
};
