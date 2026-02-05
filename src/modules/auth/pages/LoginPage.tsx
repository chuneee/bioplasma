import { useState } from "react";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";
import bioPlasmaLogo from "figma:asset/175af98dc3b4599e36e3eb47be9bf1f4fb2a405b.png";
import { LoginForm } from "../components/LoginForm";
import { RecoverPassword } from "../components/RecoverPassword";
export const LoginPage = () => {
  const [loginView, setLoginView] = useState<"login" | "recover">("login");
  return (
    <>
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
              <LoginForm onSwitchToRecover={() => setLoginView("recover")} />
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
    </>
  );
};
