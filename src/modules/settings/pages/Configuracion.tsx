import React, { useState } from "react";
import {
  Building2,
  Clock,
  Users,
  Shield,
  CreditCard,
  Bell,
  Database,
  Palette,
  FileText,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  DollarSign,
  Percent,
  Calendar,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  X,
  Download,
} from "lucide-react";

type ConfigSection =
  | "clinica"
  | "horarios"
  | "usuarios"
  | "metodosPago"
  | "notificaciones"
  | "respaldos"
  | "impuestos"
  | "terminos";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: "admin" | "receptionist";
  activo: boolean;
}

interface HorarioConfig {
  dia: string;
  abierto: boolean;
  inicio: string;
  fin: string;
}

export function Configuracion() {
  const [seccionActiva, setSeccionActiva] = useState<ConfigSection>("clinica");
  const [showPassword, setShowPassword] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState<string | null>(null);

  // Estados de configuración
  const [configClinica, setConfigClinica] = useState({
    nombre: "Bio Plasma",
    razonSocial: "Bio Plasma Medicina Estética S.A. de C.V.",
    rfc: "BPM123456789",
    telefono: "(662) 123-4567",
    email: "contacto@bioplasma.mx",
    whatsapp: "6621234567",
    direccion: "Blvd. Luis Encinas 123, Col. Centro",
    ciudad: "Hermosillo",
    estado: "Sonora",
    codigoPostal: "83000",
    website: "www.bioplasma.mx",
    instagram: "@bioplasma_hmo",
    facebook: "BioplasmaHermosillo",
    logo: null as File | null,
  });

  const [horarios, setHorarios] = useState<HorarioConfig[]>([
    { dia: "Lunes", abierto: true, inicio: "09:00", fin: "18:00" },
    { dia: "Martes", abierto: true, inicio: "09:00", fin: "18:00" },
    { dia: "Miércoles", abierto: true, inicio: "09:00", fin: "18:00" },
    { dia: "Jueves", abierto: true, inicio: "09:00", fin: "18:00" },
    { dia: "Viernes", abierto: true, inicio: "09:00", fin: "18:00" },
    { dia: "Sábado", abierto: true, inicio: "10:00", fin: "14:00" },
    { dia: "Domingo", abierto: false, inicio: "09:00", fin: "18:00" },
  ]);

  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      nombre: "Dra. Mayra Alejandra Paz",
      email: "mayra@bioplasma.mx",
      rol: "admin",
      activo: true,
    },
    {
      id: "2",
      nombre: "María López",
      email: "maria@bioplasma.mx",
      rol: "receptionist",
      activo: true,
    },
  ]);

  const [metodosPago, setMetodosPago] = useState({
    efectivo: true,
    tarjetaDebito: true,
    tarjetaCredito: true,
    transferencia: true,
    comisionTarjeta: 3.5,
  });

  const [notificaciones, setNotificaciones] = useState({
    recordatoriosCitas: true,
    horasAntes: 24,
    whatsapp: true,
    email: true,
    confirmacionCitas: true,
    cumpleanos: true,
    promociones: true,
  });

  const [impuestos, setImpuestos] = useState({
    iva: 16,
    retencionIsr: 0,
    incluirIva: true,
  });

  const handleGuardar = () => {
    // Simulación de guardado
    setGuardadoExitoso(true);
    setTimeout(() => setGuardadoExitoso(false), 3000);
  };

  const handleUpdateHorario = (
    index: number,
    field: keyof HorarioConfig,
    value: any,
  ) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index] = { ...nuevosHorarios[index], [field]: value };
    setHorarios(nuevosHorarios);
  };

  const handleExportarRespaldo = () => {
    alert("Generando respaldo de datos...");
  };

  const handleImportarRespaldo = () => {
    alert("Selecciona un archivo de respaldo...");
  };

  const secciones = [
    {
      id: "clinica" as ConfigSection,
      label: "Información de la Clínica",
      icon: Building2,
    },
    {
      id: "horarios" as ConfigSection,
      label: "Horarios de Atención",
      icon: Clock,
    },
    {
      id: "usuarios" as ConfigSection,
      label: "Usuarios y Permisos",
      icon: Users,
    },
    {
      id: "metodosPago" as ConfigSection,
      label: "Métodos de Pago",
      icon: CreditCard,
    },
    {
      id: "impuestos" as ConfigSection,
      label: "Impuestos y Facturación",
      icon: FileText,
    },
    {
      id: "notificaciones" as ConfigSection,
      label: "Notificaciones",
      icon: Bell,
    },
    { id: "respaldos" as ConfigSection, label: "Respaldos", icon: Database },
    {
      id: "terminos" as ConfigSection,
      label: "Términos y Políticas",
      icon: Shield,
    },
  ];

  const renderClinicaConfig = () => (
    <div className="space-y-6">
      {/* Logo */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Logo de la Clínica
        </h3>
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-xl bg-[var(--color-bg)] border-2 border-dashed border-[var(--color-border)] flex items-center justify-center">
            {configClinica.logo ? (
              <img
                src={URL.createObjectURL(configClinica.logo)}
                alt="Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className="text-center">
                <Upload
                  size={32}
                  className="text-[var(--color-text-secondary)] mx-auto mb-2"
                />
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Sin logo
                </p>
              </div>
            )}
          </div>
          <div className="flex-1">
            <label
              className="block px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg cursor-pointer hover:opacity-90 transition-all text-center"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              <Upload size={16} className="inline mr-2" />
              Subir Logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setConfigClinica({
                      ...configClinica,
                      logo: e.target.files[0],
                    });
                  }
                }}
              />
            </label>
            <p
              className="text-[var(--color-text-secondary)] mt-2"
              style={{ fontSize: "13px" }}
            >
              Recomendado: 512x512px, formato PNG con fondo transparente
            </p>
          </div>
        </div>
      </div>

      {/* Información General */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Información General
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Nombre Comercial
            </label>
            <input
              type="text"
              value={configClinica.nombre}
              onChange={(e) =>
                setConfigClinica({ ...configClinica, nombre: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Razón Social
            </label>
            <input
              type="text"
              value={configClinica.razonSocial}
              onChange={(e) =>
                setConfigClinica({
                  ...configClinica,
                  razonSocial: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              RFC
            </label>
            <input
              type="text"
              value={configClinica.rfc}
              onChange={(e) =>
                setConfigClinica({ ...configClinica, rfc: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              <Phone size={14} className="inline mr-1" />
              Teléfono
            </label>
            <input
              type="tel"
              value={configClinica.telefono}
              onChange={(e) =>
                setConfigClinica({ ...configClinica, telefono: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              <Mail size={14} className="inline mr-1" />
              Email
            </label>
            <input
              type="email"
              value={configClinica.email}
              onChange={(e) =>
                setConfigClinica({ ...configClinica, email: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              WhatsApp
            </label>
            <input
              type="tel"
              value={configClinica.whatsapp}
              onChange={(e) =>
                setConfigClinica({ ...configClinica, whatsapp: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="6621234567"
            />
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          <MapPin size={16} className="inline mr-2" />
          Ubicación
        </h3>
        <div className="space-y-4">
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Dirección
            </label>
            <input
              type="text"
              value={configClinica.direccion}
              onChange={(e) =>
                setConfigClinica({
                  ...configClinica,
                  direccion: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-[var(--color-text-secondary)] mb-2"
                style={{ fontSize: "14px" }}
              >
                Ciudad
              </label>
              <input
                type="text"
                value={configClinica.ciudad}
                onChange={(e) =>
                  setConfigClinica({ ...configClinica, ciudad: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label
                className="block text-[var(--color-text-secondary)] mb-2"
                style={{ fontSize: "14px" }}
              >
                Estado
              </label>
              <input
                type="text"
                value={configClinica.estado}
                onChange={(e) =>
                  setConfigClinica({ ...configClinica, estado: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label
                className="block text-[var(--color-text-secondary)] mb-2"
                style={{ fontSize: "14px" }}
              >
                Código Postal
              </label>
              <input
                type="text"
                value={configClinica.codigoPostal}
                onChange={(e) =>
                  setConfigClinica({
                    ...configClinica,
                    codigoPostal: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Redes Sociales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              <Globe size={14} className="inline mr-1" />
              Sitio Web
            </label>
            <input
              type="text"
              value={configClinica.website}
              onChange={(e) =>
                setConfigClinica({ ...configClinica, website: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              <Instagram size={14} className="inline mr-1" />
              Instagram
            </label>
            <input
              type="text"
              value={configClinica.instagram}
              onChange={(e) =>
                setConfigClinica({
                  ...configClinica,
                  instagram: e.target.value,
                })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="@usuario"
            />
          </div>
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              <Facebook size={14} className="inline mr-1" />
              Facebook
            </label>
            <input
              type="text"
              value={configClinica.facebook}
              onChange={(e) =>
                setConfigClinica({ ...configClinica, facebook: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="NombrePagina"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHorariosConfig = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Horario de Atención
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-6"
          style={{ fontSize: "14px" }}
        >
          Configura los días y horarios en los que la clínica atiende
        </p>

        <div className="space-y-3">
          {horarios.map((horario, index) => (
            <div
              key={horario.dia}
              className="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-[var(--color-border)] rounded-lg"
            >
              <div className="flex items-center gap-3 md:w-40">
                <input
                  type="checkbox"
                  checked={horario.abierto}
                  onChange={(e) =>
                    handleUpdateHorario(index, "abierto", e.target.checked)
                  }
                  className="w-4 h-4 text-[var(--color-primary)] rounded"
                />
                <span style={{ fontWeight: 500, fontSize: "14px" }}>
                  {horario.dia}
                </span>
              </div>

              {horario.abierto ? (
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <label
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "13px" }}
                    >
                      De:
                    </label>
                    <input
                      type="time"
                      value={horario.inicio}
                      onChange={(e) =>
                        handleUpdateHorario(index, "inicio", e.target.value)
                      }
                      className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                  <span className="text-[var(--color-text-secondary)]">—</span>
                  <div className="flex items-center gap-2">
                    <label
                      className="text-[var(--color-text-secondary)]"
                      style={{ fontSize: "13px" }}
                    >
                      A:
                    </label>
                    <input
                      type="time"
                      value={horario.fin}
                      onChange={(e) =>
                        handleUpdateHorario(index, "fin", e.target.value)
                      }
                      className="px-3 py-1.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              ) : (
                <span
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "14px" }}
                >
                  Cerrado
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle
              size={20}
              className="text-blue-600 flex-shrink-0 mt-0.5"
            />
            <div>
              <p
                className="text-blue-900"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Importante
              </p>
              <p className="text-blue-700 mt-1" style={{ fontSize: "13px" }}>
                Los horarios configurados aquí se usarán para agendar citas y
                definir disponibilidad en el calendario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsuariosConfig = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="mb-1" style={{ fontWeight: 600, fontSize: "16px" }}>
              Usuarios del Sistema
            </h3>
            <p
              className="text-[var(--color-text-secondary)]"
              style={{ fontSize: "14px" }}
            >
              Gestiona los usuarios que tienen acceso al sistema
            </p>
          </div>
          <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
            <Plus size={16} />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>
              Nuevo Usuario
            </span>
          </button>
        </div>

        <div className="space-y-3">
          {usuarios.map((usuario) => (
            <div
              key={usuario.id}
              className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-bg)] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white">
                  <span style={{ fontSize: "16px", fontWeight: 600 }}>
                    {usuario.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h4 style={{ fontWeight: 500, fontSize: "14px" }}>
                    {usuario.nombre}
                  </h4>
                  <p
                    className="text-[var(--color-text-secondary)]"
                    style={{ fontSize: "13px" }}
                  >
                    {usuario.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right mr-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      usuario.rol === "admin"
                        ? "bg-[var(--color-primary)]"
                        : "bg-blue-500"
                    }`}
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    {usuario.rol === "admin"
                      ? "Administrador"
                      : "Recepcionista"}
                  </span>
                  <p
                    className="text-[var(--color-text-secondary)] mt-1"
                    style={{ fontSize: "11px" }}
                  >
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </p>
                </div>
                <button className="p-2 hover:bg-[var(--color-bg)] rounded-lg transition-all">
                  <Edit2
                    size={16}
                    className="text-[var(--color-text-secondary)]"
                  />
                </button>
                {usuario.id !== "1" && (
                  <button className="p-2 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-3">
            <Shield size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p
                className="text-amber-900"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                Permisos por rol
              </p>
              <ul
                className="text-amber-700 mt-2 space-y-1"
                style={{ fontSize: "13px" }}
              >
                <li>
                  • <strong>Administrador:</strong> Acceso completo a todos los
                  módulos
                </li>
                <li>
                  • <strong>Recepcionista:</strong> Pacientes, Agenda,
                  Cotizaciones, Ventas (sin eliminar)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMetodosPagoConfig = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Métodos de Pago Aceptados
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-6"
          style={{ fontSize: "14px" }}
        >
          Selecciona los métodos de pago que acepta la clínica
        </p>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-green-600" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>Efectivo</p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Pago en efectivo en el momento
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={metodosPago.efectivo}
              onChange={(e) =>
                setMetodosPago({ ...metodosPago, efectivo: e.target.checked })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-blue-600" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>
                  Tarjeta de Débito
                </p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Pagos con tarjeta de débito
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={metodosPago.tarjetaDebito}
              onChange={(e) =>
                setMetodosPago({
                  ...metodosPago,
                  tarjetaDebito: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-purple-600" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>
                  Tarjeta de Crédito
                </p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Pagos con tarjeta de crédito
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={metodosPago.tarjetaCredito}
              onChange={(e) =>
                setMetodosPago({
                  ...metodosPago,
                  tarjetaCredito: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-[var(--color-primary)]" />
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>
                  Transferencia Bancaria
                </p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Transferencias electrónicas
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={metodosPago.transferencia}
              onChange={(e) =>
                setMetodosPago({
                  ...metodosPago,
                  transferencia: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>
        </div>
      </div>

      {/* Comisión por tarjeta */}
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Comisión por Tarjeta
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-4"
          style={{ fontSize: "14px" }}
        >
          Porcentaje de comisión bancaria en pagos con tarjeta
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-xs">
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Porcentaje de comisión
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={metodosPago.comisionTarjeta}
                onChange={(e) =>
                  setMetodosPago({
                    ...metodosPago,
                    comisionTarjeta: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2.5 pr-10 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
              <Percent
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex-1">
            <p className="text-blue-900" style={{ fontSize: "13px" }}>
              <strong>Ejemplo:</strong> Con una comisión del{" "}
              {metodosPago.comisionTarjeta}%, una venta de $1,000 generará una
              comisión de $
              {((1000 * metodosPago.comisionTarjeta) / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderImpuestosConfig = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Configuración de Impuestos
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-6"
          style={{ fontSize: "14px" }}
        >
          Define los impuestos aplicables a los servicios y productos
        </p>

        <div className="space-y-6">
          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              IVA (%)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={impuestos.iva}
                onChange={(e) =>
                  setImpuestos({
                    ...impuestos,
                    iva: parseFloat(e.target.value),
                  })
                }
                className="w-32 px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={impuestos.incluirIva}
                  onChange={(e) =>
                    setImpuestos({ ...impuestos, incluirIva: e.target.checked })
                  }
                  className="w-4 h-4 text-[var(--color-primary)] rounded"
                />
                <span style={{ fontSize: "14px" }}>
                  Incluir IVA en precios mostrados
                </span>
              </label>
            </div>
          </div>

          <div>
            <label
              className="block text-[var(--color-text-secondary)] mb-2"
              style={{ fontSize: "14px" }}
            >
              Retención ISR (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={impuestos.retencionIsr}
              onChange={(e) =>
                setImpuestos({
                  ...impuestos,
                  retencionIsr: parseFloat(e.target.value),
                })
              }
              className="w-32 px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
            <p
              className="text-[var(--color-text-secondary)] mt-2"
              style={{ fontSize: "13px" }}
            >
              Aplica solo para ciertos servicios profesionales
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p
            className="text-green-900 mb-2"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            Ejemplo de cálculo:
          </p>
          <div
            className="text-green-700 space-y-1"
            style={{ fontSize: "13px" }}
          >
            <p>Precio base: $1,000.00</p>
            <p>
              IVA ({impuestos.iva}%): $
              {((1000 * impuestos.iva) / 100).toFixed(2)}
            </p>
            <p
              className="pt-1 border-t border-green-300"
              style={{ fontWeight: 600 }}
            >
              Total: ${(1000 + (1000 * impuestos.iva) / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificacionesConfig = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Recordatorios de Citas
        </h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div>
              <p style={{ fontWeight: 500, fontSize: "14px" }}>
                Activar recordatorios automáticos
              </p>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                Enviar recordatorios antes de las citas
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificaciones.recordatoriosCitas}
              onChange={(e) =>
                setNotificaciones({
                  ...notificaciones,
                  recordatoriosCitas: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          {notificaciones.recordatoriosCitas && (
            <div className="ml-4 pl-4 border-l-2 border-[var(--color-border)]">
              <label
                className="block text-[var(--color-text-secondary)] mb-2"
                style={{ fontSize: "14px" }}
              >
                Enviar recordatorio con anticipación
              </label>
              <select
                value={notificaciones.horasAntes}
                onChange={(e) =>
                  setNotificaciones({
                    ...notificaciones,
                    horasAntes: parseInt(e.target.value),
                  })
                }
                className="px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="1">1 hora antes</option>
                <option value="2">2 horas antes</option>
                <option value="4">4 horas antes</option>
                <option value="24">24 horas antes</option>
                <option value="48">48 horas antes</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Canales de Notificación
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <span style={{ fontSize: "18px" }}>📱</span>
              </div>
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>WhatsApp</p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Mensajes vía WhatsApp Business
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificaciones.whatsapp}
              onChange={(e) =>
                setNotificaciones({
                  ...notificaciones,
                  whatsapp: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p style={{ fontWeight: 500, fontSize: "14px" }}>Email</p>
                <p
                  className="text-[var(--color-text-secondary)]"
                  style={{ fontSize: "12px" }}
                >
                  Correo electrónico
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificaciones.email}
              onChange={(e) =>
                setNotificaciones({
                  ...notificaciones,
                  email: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Otras Notificaciones
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div>
              <p style={{ fontWeight: 500, fontSize: "14px" }}>
                Confirmación de citas
              </p>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                Enviar confirmación al agendar una cita
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificaciones.confirmacionCitas}
              onChange={(e) =>
                setNotificaciones({
                  ...notificaciones,
                  confirmacionCitas: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div>
              <p style={{ fontWeight: 500, fontSize: "14px" }}>
                Cumpleaños de pacientes
              </p>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                Felicitar a pacientes en su cumpleaños
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificaciones.cumpleanos}
              onChange={(e) =>
                setNotificaciones({
                  ...notificaciones,
                  cumpleanos: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-bg)] transition-all">
            <div>
              <p style={{ fontWeight: 500, fontSize: "14px" }}>Promociones</p>
              <p
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                Enviar notificaciones de ofertas y promociones
              </p>
            </div>
            <input
              type="checkbox"
              checked={notificaciones.promociones}
              onChange={(e) =>
                setNotificaciones({
                  ...notificaciones,
                  promociones: e.target.checked,
                })
              }
              className="w-5 h-5 text-[var(--color-primary)] rounded"
            />
          </label>
        </div>
      </div>
    </div>
  );

  const renderRespaldosConfig = () => (
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

  const renderTerminosConfig = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Términos y Condiciones
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-4"
          style={{ fontSize: "14px" }}
        >
          Define los términos que aparecerán en cotizaciones y documentos
        </p>
        <textarea
          rows={8}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          placeholder="Ejemplo: Los servicios prestados son responsabilidad de la clínica Bio Plasma. Los resultados pueden variar según cada paciente..."
          defaultValue="Los servicios prestados son responsabilidad de la clínica Bio Plasma. Los resultados pueden variar según cada paciente. Se requiere un anticipo del 50% para agendar citas. Las cancelaciones deben realizarse con al menos 24 horas de anticipación."
        />
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Política de Privacidad
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-4"
          style={{ fontSize: "14px" }}
        >
          Información sobre el manejo de datos personales
        </p>
        <textarea
          rows={8}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          placeholder="Ejemplo: En Bio Plasma respetamos tu privacidad. Los datos personales son utilizados únicamente para..."
          defaultValue="En Bio Plasma respetamos tu privacidad. Los datos personales son utilizados únicamente para la prestación de servicios médicos estéticos y no serán compartidos con terceros sin tu consentimiento. Cumplimos con la Ley Federal de Protección de Datos Personales en Posesión de Particulares."
        />
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Consentimiento Informado
        </h3>
        <p
          className="text-[var(--color-text-secondary)] mb-4"
          style={{ fontSize: "14px" }}
        >
          Texto del consentimiento para tratamientos
        </p>
        <textarea
          rows={8}
          className="w-full px-4 py-3 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          placeholder="Ejemplo: Yo _____________ acepto recibir el tratamiento de _____________ habiendo sido informado(a) de..."
          defaultValue="Yo, el/la paciente, acepto recibir el tratamiento indicado habiendo sido informado(a) de los beneficios, riesgos y cuidados posteriores. Entiendo que los resultados pueden variar y que debo seguir las indicaciones del personal médico."
        />
      </div>
    </div>
  );

  const renderContenido = () => {
    switch (seccionActiva) {
      case "clinica":
        return renderClinicaConfig();
      case "horarios":
        return renderHorariosConfig();
      case "usuarios":
        return renderUsuariosConfig();
      case "metodosPago":
        return renderMetodosPagoConfig();
      case "impuestos":
        return renderImpuestosConfig();
      case "notificaciones":
        return renderNotificacionesConfig();
      case "respaldos":
        return renderRespaldosConfig();
      case "terminos":
        return renderTerminosConfig();
      default:
        return renderClinicaConfig();
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">
          Configuración
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Personaliza y administra los ajustes de tu clínica
        </p>
      </div>

      {/* Notificación de guardado exitoso */}
      {guardadoExitoso && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle size={20} className="text-green-600" />
          <p
            className="text-green-900"
            style={{ fontSize: "14px", fontWeight: 500 }}
          >
            Configuración guardada exitosamente
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de secciones */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-4 sticky top-6">
            <nav className="space-y-1">
              {secciones.map((seccion) => {
                const Icon = seccion.icon;
                const isActive = seccionActiva === seccion.id;

                return (
                  <button
                    key={seccion.id}
                    onClick={() => setSeccionActiva(seccion.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-[var(--color-primary)] text-white"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
                    }`}
                  >
                    <Icon size={18} />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {seccion.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenido */}
        <div className="lg:col-span-3">
          {renderContenido()}

          {/* Botón de guardar */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGuardar}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Save size={18} />
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                Guardar Cambios
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
