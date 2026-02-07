import { AlertCircle, Database, Download, Upload } from "lucide-react";

export const RespaldosConfigSection = () => {
  const handleExportarRespaldo = () => {
    alert("Generando respaldo de datos...");
  };

  const handleImportarRespaldo = () => {
    alert("Selecciona un archivo de respaldo...");
  };
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Gestión de Respaldos
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-6"
          style={{ fontSize: "14px" }}
        >
          Respalda y restaura los datos de tu clínica de manera segura
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportarRespaldo}
            className="p-6 border-2 border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Download size={24} className="text-green-600" />
            </div>
            <h4 className="mb-2" style={{ fontWeight: 600, fontSize: "16px" }}>
              Exportar Respaldo
            </h4>
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "13px" }}
            >
              Descarga una copia de seguridad de todos tus datos
            </p>
          </button>

          <button
            onClick={handleImportarRespaldo}
            className="p-6 border-2 border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Upload size={24} className="text-blue-600" />
            </div>
            <h4 className="mb-2" style={{ fontWeight: 600, fontSize: "16px" }}>
              Importar Respaldo
            </h4>
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "13px" }}
            >
              Restaura datos desde un archivo de respaldo
            </p>
          </button>
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle
              size={20}
              className="text-amber-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p
                className="text-amber-900"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Recomendaciones
              </p>
              <ul
                className="text-amber-700 mt-2 space-y-1"
                style={{ fontSize: "13px" }}
              >
                <li>
                  • Realiza respaldos periódicos (se recomienda semanalmente)
                </li>
                <li>
                  • Guarda los respaldos en un lugar seguro fuera de este
                  sistema
                </li>
                <li>• Verifica que el respaldo se descargó correctamente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Historial de Respaldos
        </h3>
        <div className="space-y-3">
          {[
            { fecha: "2024-11-25 10:30", tamano: "2.4 MB", tipo: "Manual" },
            { fecha: "2024-11-20 08:15", tamano: "2.3 MB", tipo: "Manual" },
            { fecha: "2024-11-15 14:45", tamano: "2.2 MB", tipo: "Manual" },
          ].map((respaldo, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-bg)] flex items-center justify-center">
                  <Database
                    size={20}
                    className="text-[var(--color-text-secondary)]"
                  />
                </div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: "14px" }}>
                    Respaldo {respaldo.tipo}
                  </p>
                  <p
                    className="text-[var(--color-text-secondary)]"
                    style={{ fontSize: "13px" }}
                  >
                    {respaldo.fecha} • {respaldo.tamano}
                  </p>
                </div>
              </div>
              <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg)] transition-all">
                <Download size={16} className="inline mr-2" />
                <span style={{ fontSize: "14px" }}>Descargar</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
