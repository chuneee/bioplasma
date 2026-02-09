// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./modules/auth/hooks/useAuth";

// Layouts
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { LoginPage } from "./modules/auth/pages/LoginPage";

// Guards

// Pages
import { Dashboard } from "./modules/dashboard/pages/Dashboard";
import { Pacientes } from "./modules/patients/pages/Pacientes";
import { Agenda } from "./modules/appointments/pages/Agenda";
import { Servicios } from "./modules/services/pages/Servicios";
import { Inventario } from "./modules/inventory/pages/Inventario";
import { Cotizaciones } from "./modules/quotation/pages/Cotizaciones";
import { Ventas } from "./modules/sales/pages/Ventas";
import { Finanzas } from "./modules/finance/pages/Finanzas";
import { Comisiones } from "./modules/commissions/pages/Comisiones";
import { Reportes } from "./modules/reports/pages/Reportes";
import { Configuracion } from "./modules/settings/pages/Configuracion";

// Wrappers para páginas que necesitan navegación
import {
  PacientesPageWrapper,
  ExpedientePacientePageWrapper,
} from "./components/wrappers/PatientsWrappers";
import { DashboardLayoutWrapper } from "./components/wrappers/DashboardLayoutWrapper";
import { ProtectedRoute } from "./guards/ProtectedRoute";
import { AuthorizedRoute } from "./guards/AuthorizedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección raíz */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Ruta pública - Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas - Requieren autenticación */}
        <Route element={<ProtectedRoute />}>
          {/* Layout wrapper que contiene todas las rutas del dashboard */}
          <Route element={<DashboardLayoutWrapper />}>
            {/* Dashboard */}
            <Route element={<AuthorizedRoute view="dashboard" />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Pacientes */}
            <Route element={<AuthorizedRoute view="pacientes" />}>
              <Route path="/pacientes" element={<PacientesPageWrapper />} />
              <Route
                path="/pacientes/:id"
                element={<ExpedientePacientePageWrapper />}
              />
            </Route>

            {/* Agenda */}
            <Route element={<AuthorizedRoute view="agenda" />}>
              <Route path="/agenda" element={<Agenda />} />
            </Route>

            {/* Servicios - Solo Admin */}
            <Route element={<AuthorizedRoute view="servicios" />}>
              <Route path="/servicios" element={<Servicios />} />
            </Route>

            {/* Inventario - Solo Admin */}
            <Route element={<AuthorizedRoute view="inventario" />}>
              <Route path="/inventario" element={<Inventario />} />
            </Route>

            {/* Cotizaciones */}
            <Route element={<AuthorizedRoute view="cotizaciones" />}>
              <Route path="/cotizaciones" element={<Cotizaciones />} />
            </Route>

            {/* Ventas */}
            <Route element={<AuthorizedRoute view="ventas" />}>
              <Route path="/ventas" element={<Ventas />} />
            </Route>

            {/* Finanzas - Solo Admin */}
            <Route element={<AuthorizedRoute view="finanzas" />}>
              <Route path="/finanzas" element={<Finanzas />} />
            </Route>

            {/* Comisiones - Solo Admin */}
            <Route element={<AuthorizedRoute view="comisiones" />}>
              <Route path="/comisiones" element={<Comisiones />} />
            </Route>

            {/* Reportes - Solo Admin */}
            <Route element={<AuthorizedRoute view="reportes" />}>
              <Route path="/reportes" element={<Reportes />} />
            </Route>

            {/* Configuración - Solo Admin */}
            <Route element={<AuthorizedRoute view="configuracion" />}>
              <Route path="/configuracion" element={<Configuracion />} />
            </Route>
          </Route>
        </Route>

        {/* 404 - Redirige al dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
