import React, { useState } from "react";
import { PlaceholderView } from "./components/legacy/PlaceholderView";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import bioPlasmaLogo from "figma:asset/175af98dc3b4599e36e3eb47be9bf1f4fb2a405b.png";
import { LoginForm } from "./modules/auth/pages/LoginForm";
import { RecoverPassword } from "./modules/auth/pages/RecoverPassword";
import { Dashboard } from "./modules/dashboard/pages/Dashboard";
import { Configuracion } from "./modules/settings/pages/Configuracion";
import { Pacientes } from "./modules/patients/pages/Pacientes";
import { Agenda } from "./modules/appointments/pages/Agenda";
import { Servicios } from "./modules/services/pages/Servicios";
import { Inventario } from "./modules/inventory/pages/Inventario";
import { Cotizaciones } from "./modules/quotation/pages/Cotizaciones";
import { Ventas } from "./modules/sales/pages/Ventas";
import { Finanzas } from "./modules/finance/pages/Finanzas";
import { Comisiones } from "./modules/commissions/pages/Comisiones";
import { Reportes } from "./modules/reports/pages/Reportes";
import { ExpedientePaciente } from "./modules/patients/components/ExpedientePaciente";
import { DashboardLayout } from "./components/layouts/DashboardLayout";

type ViewType =
  | "dashboard"
  | "pacientes"
  | "agenda"
  | "servicios"
  | "inventario"
  | "cotizaciones"
  | "ventas"
  | "finanzas"
  | "comisiones"
  | "reportes"
  | "configuracion";

export default function App() {
  const [loginView, setLoginView] = useState<"login" | "recover">("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [userRole, setUserRole] = useState<"admin" | "receptionist">("admin");
  const [selectedPacienteId, setSelectedPacienteId] = useState<string | null>(
    null,
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginView("login");
    setCurrentView("dashboard");
    setSelectedPacienteId(null);
  };

  const getPageTitle = () => {
    const titles: Record<ViewType, string> = {
      dashboard: "Dashboard",
      pacientes: "Pacientes",
      agenda: "Agenda y Citas",
      servicios: "Servicios",
      inventario: "Inventario",
      cotizaciones: "Cotizaciones",
      ventas: "Ventas",
      finanzas: "Finanzas",
      comisiones: "Comisiones",
      reportes: "Reportes",
      configuracion: "Configuración",
    };
    return titles[currentView];
  };

  const renderContent = () => {
    const userName = userRole === "admin" ? "Dra. Mayra" : "María";

    switch (currentView) {
      case "dashboard":
        return <Dashboard userName={userName} />;
      case "pacientes":
        if (selectedPacienteId) {
          return (
            <ExpedientePaciente
              pacienteId={selectedPacienteId}
              onBack={() => setSelectedPacienteId(null)}
            />
          );
        }
        return (
          <Pacientes
            onNavigateToExpediente={(id) => setSelectedPacienteId(id)}
          />
        );
      case "agenda":
        return <Agenda />;
      case "servicios":
        return <Servicios />;
      case "inventario":
        return <Inventario />;
      case "cotizaciones":
        return <Cotizaciones />;
      case "ventas":
        return <Ventas />;
      case "finanzas":
        return <Finanzas />;
      case "comisiones":
        return <Comisiones />;
      case "reportes":
        return <Reportes />;
      case "configuracion":
        return <Configuracion />;
      default:
        return <Dashboard userName={userName} />;
    }
  };

  if (isAuthenticated) {
    return (
      <DashboardLayout
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as ViewType)}
        userRole={userRole}
        pageTitle={getPageTitle()}
        onLogout={handleLogout}
      >
        {renderContent()}
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Panel Izquierdo - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#FFF8F8] via-[#FFF0F0] to-[#FFE8E8]">
        {/* Imagen decorativa de fondo */}
        <div className="absolute inset-0 opacity-15">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1754522711595-84428937b07a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMGFlc3RoZXRpYyUyMHNwYXxlbnwxfHx8fDE3NjQzNjI5Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Bio Plasma"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Patrón decorativo sutil */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="pattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="#D49494"
                  strokeWidth="0.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="#E8A6A6"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        {/* Contenido del panel */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16">
          {/* Logo */}
          <div className="mb-12 text-center">
            <div className="mb-6">
              <img
                src={bioPlasmaLogo}
                alt="Bio Plasma - Revitaliza tu piel"
                className="w-80 h-auto mx-auto drop-shadow-lg"
              />
            </div>
          </div>

          {/* Formas orgánicas decorativas */}
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-[#E8A6A6] opacity-15 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-56 h-56 rounded-full bg-[#D49494] opacity-15 blur-3xl"></div>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:px-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 text-center">
            <img
              src={bioPlasmaLogo}
              alt="Bio Plasma - Revitaliza tu piel"
              className="w-64 h-auto mx-auto drop-shadow-md"
            />
          </div>

          {/* Formularios */}
          {loginView === "login" ? (
            <LoginForm
              onSwitchToRecover={() => setLoginView("recover")}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            <RecoverPassword onBack={() => setLoginView("login")} />
          )}
        </div>
      </div>

      {/* Background decorativo mobile */}
      <div className="lg:hidden fixed inset-0 -z-10 bg-gradient-to-br from-[#FFF8F8] via-white to-[#FFE8E8]">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E8A6A6] opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#D49494] opacity-10 blur-3xl"></div>
      </div>
    </div>
  );
}
