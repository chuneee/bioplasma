import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Save,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Clinic } from "../types/clinic.type";
import { API_BASE_URL } from "../../../shared/api/axios";
import { usePermissions } from "../../auth/hooks/usePermissions";
import { message } from "../../../components/shared/message/message";

interface ClinicConfig {
  clinica: Clinic | undefined;
  onSave: (data: Clinic) => void;
  logo_url?: string;
  onUploadLogo?: (file: File) => void;
}

interface LogoSectionComponentProps {
  logo_path?: string;
  onUploadLogo?: (file: File) => void;
}

export const ClinicaConfigSection = ({
  clinica,
  onSave,
  logo_url,
  onUploadLogo,
}: ClinicConfig) => {
  const [configClinica, setConfigClinica] = useState<Clinic | undefined>();
  const { hasPermission } = usePermissions();

  const canEdit = hasPermission("clinic.update");

  useEffect(() => {
    setConfigClinica(clinica);
  }, [clinica]);

  const handleGuardar = () => {
    onSave?.(configClinica!);
  };

  const handleCancelar = () => {
    setConfigClinica(clinica);
    message.info("Cambios cancelados");
  };

  const LogoSectionComponent = ({
    logo_path,
    onUploadLogo,
  }: LogoSectionComponentProps) => {
    const [logoPath, setLogoPath] = useState<string | undefined>(undefined);

    useEffect(() => {
      setLogoPath(`${API_BASE_URL}${logo_path}`);
    }, [logo_path]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setLogoPath(URL.createObjectURL(file));
        onUploadLogo?.(file);
      }
    };

    return (
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="mb-4" style={{ fontWeight: 600, fontSize: "16px" }}>
          Logo de la Clínica
        </h3>
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 rounded-xl bg-[var(--color-bg)] border-2 border-dashed border-[var(--color-border)] flex items-center justify-center">
            {logo_path ? (
              <img
                src={logoPath}
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
              hidden={!canEdit}
            >
              <Upload size={16} className="inline mr-2" />
              Subir Logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={!canEdit}
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <LogoSectionComponent logo_path={logo_url} onUploadLogo={onUploadLogo} />
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
              value={configClinica?.trade_name}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({
                  ...configClinica,
                  trade_name: e.target.value,
                })
              }
              disabled={!canEdit}
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
              value={configClinica?.company_name || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({
                  ...configClinica,
                  company_name: e.target.value,
                })
              }
              disabled={!canEdit}
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
              value={configClinica?.rfc || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({ ...configClinica, rfc: e.target.value })
              }
              disabled={!canEdit}
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
              value={configClinica?.phone || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({ ...configClinica, phone: e.target.value })
              }
              disabled={!canEdit}
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
              value={configClinica?.email || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({ ...configClinica, email: e.target.value })
              }
              disabled={!canEdit}
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
              value={configClinica?.whatsapp || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({ ...configClinica, whatsapp: e.target.value })
              }
              disabled={!canEdit}
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
              value={configClinica?.address || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({
                  ...configClinica,
                  address: e.target.value,
                })
              }
              disabled={!canEdit}
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
                value={configClinica?.city || ""}
                onChange={(e) =>
                  configClinica &&
                  setConfigClinica({ ...configClinica, city: e.target.value })
                }
                disabled={!canEdit}
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
                value={configClinica?.state || ""}
                onChange={(e) =>
                  configClinica &&
                  setConfigClinica({ ...configClinica, state: e.target.value })
                }
                disabled={!canEdit}
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
                value={configClinica?.zip_code || ""}
                onChange={(e) =>
                  configClinica &&
                  setConfigClinica({
                    ...configClinica,
                    zip_code: e.target.value,
                  })
                }
                disabled={!canEdit}
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
              value={configClinica?.website || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({ ...configClinica, website: e.target.value })
              }
              disabled={!canEdit}
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
              value={configClinica?.instagram || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({
                  ...configClinica,
                  instagram: e.target.value,
                })
              }
              disabled={!canEdit}
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
              value={configClinica?.facebook || ""}
              onChange={(e) =>
                configClinica &&
                setConfigClinica({ ...configClinica, facebook: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
              placeholder="NombrePagina"
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* Botón de guardar */}
      <div className="mt-6 flex justify-end gap-4" hidden={!canEdit}>
        <button
          onClick={handleGuardar}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Save size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>
            Guardar Cambios
          </span>
        </button>
        <button
          onClick={handleCancelar}
          className="px-6 py-3 bg-[var(--color-error)] text-white rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
        >
          <X size={18} />
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Cancelar</span>
        </button>
      </div>
    </div>
  );
};
