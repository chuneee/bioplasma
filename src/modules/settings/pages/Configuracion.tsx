import { useEffect, useState } from "react";
import {
  Building2,
  Clock,
  Users,
  Shield,
  CreditCard,
  Bell,
  Database,
  FileText,
  CheckCircle,
  X,
} from "lucide-react";
import { ClinicaConfigSection } from "../components/clinicConfigSection";
import { HorariosConfigSection } from "../components/horariosConfigSection";
import { UsuariosManageSection } from "../components/usuariosManage";
import { MetodospagosConfigSection } from "../components/metodosPagos";
import { ImpuestosConfigSection } from "../components/impuestos";
import { NotificacionesConfigSection } from "../components/notificacionesConfigComponent";
import { RespaldosConfigSection } from "../components/respandosConfigComponents";
import { TerminosConfigSection } from "../components/terminosConfigComponent";
import { ClinicService } from "../services/clinic.service";
import { Clinic, ClinicCredentials } from "../types/clinic.type";
import { PaymentMethodService } from "../services/payment-method.service";
import { PaymentMethod } from "../types/payment-methods.type";
import { Taxes } from "../types/taxes.type";
import { TaxesService } from "../services/taxes.service";
import { NotificationSettings } from "../types/notification-settings.type";
import { NotificationSettingService } from "../services/notification-setting.service";
import { TermsAndPolicies } from "../types/terms-and-policies.type";
import { TermsAndPoliciesService } from "../services/terms-and-policies.service";
import { ClinicBusinessHour } from "../types/clinic_business_hour.type";
import { message } from "../../../components/shared/message/message";

type ConfigSection =
  | "clinica"
  | "horarios"
  | "usuarios"
  | "metodosPago"
  | "notificaciones"
  | "respaldos"
  | "impuestos"
  | "terminos";

export function Configuracion() {
  const [seccionActiva, setSeccionActiva] = useState<ConfigSection>("clinica");
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const [clinicData, setClinicData] = useState<Clinic | undefined>(undefined);

  const [ClinicBussinesHourData, setClinicBusinessHourData] = useState<
    ClinicBusinessHour[] | undefined
  >(undefined);

  const [paymentMethodsData, setPaymentMethodsData] = useState<
    PaymentMethod | undefined
  >(undefined);

  const [notificationSettingsData, setNotificationSettingsData] = useState<
    NotificationSettings | undefined
  >(undefined);

  const [taxesData, setTaxesData] = useState<Taxes | undefined>(undefined);
  const [termsAndPoliciesData, setTermsAndPoliciesData] = useState<
    TermsAndPolicies | undefined
  >(undefined);

  const showMessage = (type: "success" | "error") => {
    const text =
      type === "success"
        ? "Operación realizada con éxito"
        : "Ocurrió un error durante la operación";
    message[type](text);
  };

  const fecthInitData = async () => {
    try {
      const [
        clinicData,
        clinicBusinessHourData,
        paymentMethodsData,
        taxesData,
        notificationSettingsData,
        termsAndPoliciesData,
      ] = await Promise.all([
        ClinicService.getClinicInfo(),
        ClinicService.getClinicBusinessHours(),
        PaymentMethodService.getPaymentMethods(),
        TaxesService.getTaxes(),
        NotificationSettingService.getNotificationSettings(),
        TermsAndPoliciesService.getTermsAndPolicies(),
      ]);
      setPaymentMethodsData(paymentMethodsData);
      setClinicData(clinicData);
      setClinicBusinessHourData(clinicBusinessHourData);
      setTaxesData(taxesData);
      setNotificationSettingsData(notificationSettingsData);
      setTermsAndPoliciesData(termsAndPoliciesData);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      message.error("Error al cargar los datos iniciales");
    }
  };

  useEffect(() => {
    fecthInitData();
  }, []);
  // * Handlers CLINICA
  const onSaveClinica = async (data: ClinicCredentials) => {
    try {
      const { id, logo_url, createdAt, updatedAt, ...credentials } =
        data as Clinic;

      const response = await ClinicService.updateClinicInfo(id, credentials);

      setClinicData(response);
      showMessage("success");
    } catch (error) {
      console.error("Error al guardar los datos de la clínica:", error);
      showMessage("error");
    }
  };

  const onUploadLogo = async (file: File) => {
    const uuid = clinicData?.id;

    const beforeUploadLogo = clinicData?.logo_url;

    try {
      const response = await ClinicService.uploadClinicLogo(uuid!, file);

      setClinicData((prev) =>
        prev ? { ...prev, logo_url: response.logo_url } : prev,
      );
      showMessage("success");
    } catch (error) {
      console.error("Error al subir el logo de la clínica:", error);
      setClinicData((prev) =>
        prev ? { ...prev, logo_url: beforeUploadLogo || undefined } : prev,
      );
      showMessage("error");
    }
  };

  // * Handlers CLINIC BUSINESS HOURS
  const onSaveClinicBusinessHours = async (hours: ClinicBusinessHour[]) => {
    try {
      await ClinicService.updateClinicBusinessHours(clinicData!.id, hours);
      setGuardadoExitoso(true);
      showMessage("success");
    } catch (error) {
      console.error(
        "Error al guardar los horarios de atención de la clínica:",
        error,
      );
      showMessage("error");
    }
  };

  //* Handlers MÉTODOS DE PAGO

  const onUpdatePaymentMethods = async (
    updatedData: Partial<PaymentMethod>,
  ) => {
    try {
      const { id, createdAt, updatedAt, ...rest } =
        updatedData as PaymentMethod;
      const response = await PaymentMethodService.updatePaymentMethods(
        paymentMethodsData!.id,
        rest as Partial<PaymentMethod>,
      );

      setPaymentMethodsData(response);
      showMessage("success");
    } catch (error) {
      console.error("Error al actualizar los métodos de pago:", error);
      showMessage("error");
    }
  };

  //* Handlers IMPUESTOS

  const onUpdateTaxes = async (updatedData: Partial<Taxes>) => {
    try {
      const { id, createdAt, updatedAt, ...rest } = updatedData as Taxes;
      const response = await TaxesService.updateTaxes(
        taxesData!.id,
        rest as Partial<Taxes>,
      );

      setTaxesData(response);
      showMessage("success");
    } catch (error) {
      console.error("Error al actualizar los impuestos:", error);
      showMessage("error");
    }
  };

  //* Handlers NOTIFICACIONES

  const onUpdateNotificationSettings = async (
    updatedData: Partial<NotificationSettings>,
  ) => {
    try {
      const { id, createdAt, updatedAt, ...rest } =
        updatedData as NotificationSettings;

      const response =
        await NotificationSettingService.updateNotificationSettings(
          notificationSettingsData!.id,
          rest as Partial<NotificationSettings>,
        );

      setNotificationSettingsData(response);
      showMessage("success");
    } catch (error) {
      console.error(
        "Error al actualizar las configuraciones de notificaciones:",
        error,
      );
      showMessage("error");
    }
  };

  // * Handlers TÉRMINOS Y POLÍTICAS

  const onUpdateTermsAndPolicies = async (
    updatedData: Partial<TermsAndPolicies>,
  ) => {
    const { id, createdAt, updatedAt, ...rest } =
      updatedData as TermsAndPolicies;

    try {
      const response = await TermsAndPoliciesService.updateTermsAndPolicies(
        termsAndPoliciesData!.id,
        rest as Partial<TermsAndPolicies>,
      );

      setTermsAndPoliciesData(response);
      showMessage("success");
    } catch (error) {
      console.error("Error al actualizar los términos y políticas:", error);
      showMessage("error");
    }
  };

  const secciones = [
    {
      id: "clinica" as ConfigSection,
      label: "Información de la Clínica",
      icon: Building2,
      viewComponent: (
        <ClinicaConfigSection
          clinica={clinicData}
          onSave={onSaveClinica}
          logo_url={clinicData?.logo_url}
          onUploadLogo={onUploadLogo}
        />
      ),
    },
    {
      id: "horarios" as ConfigSection,
      label: "Horarios de Atención",
      icon: Clock,
      viewComponent: (
        <HorariosConfigSection
          bussinessHours={ClinicBussinesHourData}
          onSave={onSaveClinicBusinessHours}
        />
      ),
    },
    {
      id: "usuarios" as ConfigSection,
      label: "Usuarios y Permisos",
      icon: Users,
      viewComponent: <UsuariosManageSection />,
    },
    {
      id: "metodosPago" as ConfigSection,
      label: "Métodos de Pago",
      icon: CreditCard,
      viewComponent: (
        <MetodospagosConfigSection
          paymentMethods={paymentMethodsData}
          onUpdate={onUpdatePaymentMethods}
        />
      ),
    },
    {
      id: "impuestos" as ConfigSection,
      label: "Impuestos y Facturación",
      icon: FileText,
      viewComponent: (
        <ImpuestosConfigSection
          impuestos={taxesData}
          onUpdate={onUpdateTaxes}
        />
      ),
    },
    {
      id: "notificaciones" as ConfigSection,
      label: "Notificaciones",
      icon: Bell,
      viewComponent: (
        <NotificacionesConfigSection
          notificationSettings={notificationSettingsData}
          onUpdate={onUpdateNotificationSettings}
        />
      ),
    },
    {
      id: "respaldos" as ConfigSection,
      label: "Respaldos",
      icon: Database,
      viewComponent: <RespaldosConfigSection />,
    },
    {
      id: "Terminos" as ConfigSection,
      label: "Términos y Políticas",
      icon: Shield,
      viewComponent: (
        <TerminosConfigSection
          termsAndPolicies={termsAndPoliciesData}
          onUpdate={onUpdateTermsAndPolicies}
        />
      ),
    },
  ];

  const renderContenido = () => {
    const seccion = secciones.find((s) => s.id === seccionActiva);
    return seccion?.viewComponent || null;
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
        <div className="lg:col-span-3">{renderContenido()}</div>
      </div>
    </div>
  );
}
