import { Clock, ImageIcon } from "lucide-react";
import { useState } from "react";

interface Tratamiento {
  id: string;
  fecha: string;
  hora: string;
  servicio: string;
  productos: string[];
  precio: number;
  atendio: string;
  notas: string;
  fotos: number;
}
const tratamientosMock: Tratamiento[] = [
  {
    id: "1",
    fecha: "2025-11-20",
    hora: "10:30 AM",
    servicio: "Limpieza Facial Profunda + Hidratación",
    productos: ["Ácido Hialurónico", "Vitamina C", "Plasma Rico en Plaquetas"],
    precio: 1200,
    atendio: "Dra. Mayra",
    notas:
      "Paciente tolera muy bien el tratamiento. Se observa mejora en textura de la piel. Programar siguiente sesión en 3 semanas.",
    fotos: 4,
  },
  {
    id: "2",
    fecha: "2025-10-28",
    hora: "2:00 PM",
    servicio: "Rejuvenecimiento con Plasma",
    productos: ["Plasma Rico en Plaquetas", "Colágeno"],
    precio: 2500,
    atendio: "Dra. Mayra",
    notas:
      "Excelente respuesta al tratamiento. Paciente muy satisfecha con los resultados. Sin complicaciones.",
    fotos: 6,
  },
  {
    id: "3",
    fecha: "2025-10-05",
    hora: "11:00 AM",
    servicio: "Microdermoabrasión",
    productos: ["Exfoliante Enzimático", "Mascarilla Calmante"],
    precio: 800,
    atendio: "Dra. Mayra",
    notas:
      "Tratamiento de mantenimiento. Piel en excelente estado. Paciente reporta sentirse muy cómoda.",
    fotos: 2,
  },
  {
    id: "4",
    fecha: "2025-09-12",
    hora: "3:30 PM",
    servicio: "Peeling Químico Superficial",
    productos: [
      "Ácido Glicólico 30%",
      "Neutralizante",
      "Protector Solar SPF 50",
    ],
    precio: 1500,
    atendio: "Dra. Mayra",
    notas:
      "Primera sesión de peeling. Paciente tolera bien el procedimiento. Se dan instrucciones de cuidado post-tratamiento.",
    fotos: 5,
  },
  {
    id: "5",
    fecha: "2025-08-20",
    hora: "9:00 AM",
    servicio: "Hidratación Facial Profunda",
    productos: ["Ácido Hialurónico", "Mascarilla Nutritiva"],
    precio: 900,
    atendio: "Dra. Mayra",
    notas:
      "Piel deshidratada por exposición solar. Se recomienda tratamiento intensivo de hidratación.",
    fotos: 3,
  },
];

export const PatientHistory = () => {
  const [expandedTratamiento, setExpandedTratamiento] = useState<string | null>(
    null,
  );
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="p-6">
      {/* Timeline de tratamientos */}
      <div className="relative">
        {/* Línea vertical del timeline */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--color-border)]"></div>

        <div className="space-y-6">
          {tratamientosMock.map((tratamiento, index) => (
            <div key={tratamiento.id} className="relative pl-12">
              {/* Punto del timeline */}
              <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[var(--color-primary)] border-4 border-white shadow-md flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>

              {/* Card del tratamiento */}
              <div className="bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-full"
                        style={{ fontSize: "13px", fontWeight: 600 }}
                      >
                        {formatDate(tratamiento.fecha)}
                      </span>
                      <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                        <Clock size={14} />
                        <span style={{ fontSize: "14px" }}>
                          {tratamiento.hora}
                        </span>
                      </div>
                    </div>
                    <h3 className="mb-1" style={{ fontWeight: 600 }}>
                      {tratamiento.servicio}
                    </h3>
                    <p
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "14px" }}
                    >
                      Atendió: {tratamiento.atendio}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[var(--color-secondary)] mb-1"
                      style={{ fontWeight: 700, fontSize: "20px" }}
                    >
                      {formatCurrency(tratamiento.precio)}
                    </div>
                    {tratamiento.fotos > 0 && (
                      <div className="flex items-center gap-1 text-[var(--color-text-secondary)] justify-end">
                        <ImageIcon size={14} />
                        <span style={{ fontSize: "13px" }}>
                          {tratamiento.fotos} fotos
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Productos utilizados */}
                <div className="mb-3">
                  <p
                    className="text-[var(--color-text-secondary)] mb-2"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    Productos utilizados:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tratamiento.productos.map((producto, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        {producto}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notas del tratamiento */}
                <div className="mb-4">
                  <p
                    className="text-[var(--color-text-secondary)] mb-1"
                    style={{ fontSize: "13px", fontWeight: 600 }}
                  >
                    Notas del tratamiento:
                  </p>
                  <p
                    className={`text-[var(--color-text-secondary)] ${
                      expandedTratamiento === tratamiento.id
                        ? ""
                        : "line-clamp-2"
                    }`}
                    style={{ fontSize: "14px" }}
                  >
                    {tratamiento.notas}
                  </p>
                  {tratamiento.notas.length > 100 && (
                    <button
                      onClick={() =>
                        setExpandedTratamiento(
                          expandedTratamiento === tratamiento.id
                            ? null
                            : tratamiento.id,
                        )
                      }
                      className="text-[var(--color-primary)] hover:underline mt-1"
                      style={{ fontSize: "13px" }}
                    >
                      {expandedTratamiento === tratamiento.id
                        ? "Ver menos"
                        : "Ver más"}
                    </button>
                  )}
                </div>

                {/* Botón ver detalle */}
                <button className="w-full py-2 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  Ver detalle completo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
