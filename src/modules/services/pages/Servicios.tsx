import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ServicesCard } from "../components/servicesCard";
import { ServicesTable } from "../components/servicesTable";
import { ServiceFormModal } from "../components/serviceForm";
import { countByCategoria } from "../utils/utils";
import { Service } from "../types/service.type";
import { ServicesService } from "../services/services.service";
import { message } from "../../../components/shared/message/message";
import { FiltrosServicios } from "../components/filtros";
import { ServicesDetailModal } from "../components/servicesDetail";

export function Servicios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [sortBy, setSortBy] = useState("nombre-az");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [showServiceDetailModal, setShowServiceDetailModal] = useState(false);

  const [serviciosData, setServiciosData] = useState<Service[]>([]);
  const [currentServicioData, setCurrentServicioData] =
    useState<Service | null>(null);
  const [isCopyMode, setIsCopyMode] = useState(false);

  const initData = async () => {
    try {
      const response = await ServicesService.getServicios();
      setServiciosData(response);
      // console.log("Servicios obtenidos:", response);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      message.error("No se pudieron cargar los servicios. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const handleServiceSubmit = async (service: Partial<Service>) => {
    try {
      if (currentServicioData && !isCopyMode) {
        // Actualizar servicio existente
        const response = await ServicesService.updateServicio(
          currentServicioData.id,
          service,
        );
        // console.log("Servicio actualizado:", response);
        setServiciosData((prev) =>
          prev.map((s) => (s.id === response.id ? response : s)),
        );
        message.success("Servicio actualizado correctamente");
      } else {
        const response = await ServicesService.createServicio(service);
        setServiciosData((prev) => [...prev, response]);
        message.success("Servicio creado correctamente");
      }
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      message.error("No se pudo guardar el servicio. Intenta nuevamente.");
    } finally {
      setShowNewServiceModal(false);
      setCurrentServicioData(null);
      setIsCopyMode(false);
    }
  };

  const handleEditService = (id: string, isCopy: boolean = false) => {
    const servicioToEdit = serviciosData.find((s) => s.id === id);
    if (servicioToEdit) {
      setCurrentServicioData(servicioToEdit);
      setIsCopyMode(isCopy);
      setShowNewServiceModal(true);
    } else {
      message.error("Servicio no encontrado");
    }
  };

  const handleDisableService = async (id: string) => {
    try {
      await ServicesService.disableServicio(id);
      setServiciosData((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
      );
      message.success("Servicio actualizado correctamente");
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      message.error("No se pudo eliminar el servicio. Intenta nuevamente.");
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await ServicesService.deleteServicio(id);
      setServiciosData((prev) => prev.filter((s) => s.id !== id));
      message.success("Servicio eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      message.error("No se pudo eliminar el servicio. Intenta nuevamente.");
    }
  };

  const handleShowDetails = (id: string) => {
    const servicio = serviciosData.find((s) => s.id === id);
    if (servicio) {
      setCurrentServicioData(servicio);
      setShowServiceDetailModal(true);
    } else {
      message.error("Servicio no encontrado");
    }
  };

  // Contar servicios por categoría

  // Filtrar servicios
  const filteredServicios = serviciosData
    .filter((servicio) => {
      const matchesSearch =
        servicio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servicio.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria =
        selectedCategoria === "todos" ||
        servicio.category === selectedCategoria;
      const matchesEstado =
        filterEstado === "todos" ||
        (filterEstado === "activos" && servicio.isActive === true) ||
        (filterEstado === "inactivos" && servicio.isActive === false);
      return matchesSearch && matchesCategoria && matchesEstado;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "nombre-az":
          return a.name.localeCompare(b.name);
        case "nombre-za":
          return b.name.localeCompare(a.name);
        case "precio-mayor":
          return b.price - a.price;
        case "precio-menor":
          return a.price - b.price;
        case "populares":
          // Asumiendo que tienes un campo para popularidad o ventas
          return (b.timesPerformed || 0) - (a.timesPerformed || 0);
        default:
          return 0;
      }
    });

  const serviciosActivos = serviciosData.filter(
    (s) => s.isActive === true,
  ).length;

  const Header = () => {
    return (
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">
              Servicios
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              {serviciosActivos} servicios activos
            </p>
          </div>
          <button
            onClick={() => setShowNewServiceModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            <Plus size={20} />
            <span>Nuevo Servicio</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <Header />

      {/* TABS DE NAVEGACIÓN */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <button
            onClick={() => setSelectedCategoria("todos")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === "todos"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedCategoria === "todos" ? 600 : 400 }}
          >
            Todos ({countByCategoria("todos", serviciosData)})
          </button>
          <button
            onClick={() => setSelectedCategoria("facial")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === "facial"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedCategoria === "facial" ? 600 : 400 }}
          >
            Faciales ({countByCategoria("facial", serviciosData)})
          </button>
          <button
            onClick={() => setSelectedCategoria("corporal")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === "corporal"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedCategoria === "corporal" ? 600 : 400 }}
          >
            Corporales ({countByCategoria("corporal", serviciosData)})
          </button>
          <button
            onClick={() => setSelectedCategoria("inyectable")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === "inyectable"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{
              fontWeight: selectedCategoria === "inyectable" ? 600 : 400,
            }}
          >
            Inyectables ({countByCategoria("inyectable", serviciosData)})
          </button>
          <button
            onClick={() => setSelectedCategoria("laser")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === "laser"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedCategoria === "laser" ? 600 : 400 }}
          >
            Láser ({countByCategoria("laser", serviciosData)})
          </button>
          <button
            onClick={() => setSelectedCategoria("paquete")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedCategoria === "paquete"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedCategoria === "paquete" ? 600 : 400 }}
          >
            Paquetes ({countByCategoria("paquete", serviciosData)})
          </button>
        </div>
      </div>
      {/* FILTROS */}
      <FiltrosServicios
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Vista de Tarjetas */}
      {viewMode === "cards" && (
        <ServicesCard
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          onDisable={handleDisableService}
          serviciosList={filteredServicios}
          onShowDetails={handleShowDetails}
        />
      )}

      {/* Vista de Tabla */}
      {viewMode === "table" && (
        <ServicesTable
          onEdit={handleEditService}
          onDelete={handleDeleteService}
          onDisable={handleDisableService}
          serviciosList={filteredServicios}
          onShowDetails={handleShowDetails}
        />
      )}

      {/* Modal: Nuevo Servicio */}
      <ServiceFormModal
        open={showNewServiceModal}
        onClose={() => {
          setShowNewServiceModal(false);
          setCurrentServicioData(null);
          setIsCopyMode(false);
        }}
        onSubmit={handleServiceSubmit}
        currentService={currentServicioData}
        isCopy={isCopyMode}
        servicesList={serviciosData.filter(
          (s) =>
            s.id !== currentServicioData?.id ||
            (!currentServicioData && s.isActive), // Excluir el servicio actual si estamos editando (pero no si es copia)
        )}
      />

      <ServicesDetailModal
        open={showServiceDetailModal}
        onClose={() => {
          setShowServiceDetailModal(false);
          setCurrentServicioData(null);
        }}
        service={currentServicioData as Service}
      />
    </div>
  );
}
