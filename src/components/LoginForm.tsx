import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRecover: () => void;
  onLoginSuccess: () => void;
}

export function LoginForm({ onSwitchToRecover, onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El correo electrónico es requerido';
    if (!emailRegex.test(email)) return 'Ingresa un correo electrónico válido';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'La contraseña es requerida';
    return '';
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched({ ...touched, [field]: true });
    
    if (field === 'email') {
      const error = validateEmail(email);
      setErrors({ ...errors, email: error });
    } else {
      const error = validatePassword(password);
      setErrors({ ...errors, password: error });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setErrors({});

    // Simulación de autenticación - ingreso directo sin validación
    setTimeout(() => {
      onLoginSuccess();
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="mb-2">Bienvenida</h2>
        <p className="text-[var(--color-text-secondary)]">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-[var(--color-error)] rounded-lg p-4">
            <p className="text-[var(--color-error)]">{errors.general}</p>
          </div>
        )}

        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block mb-2 text-[var(--color-text)]">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  setErrors({ ...errors, email: validateEmail(e.target.value) });
                }
              }}
              onBlur={() => handleBlur('email')}
              placeholder="ejemplo@bioplasma.com"
              disabled={isLoading}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 outline-none
                ${errors.email && touched.email 
                  ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(198,123,123,0.1)]' 
                  : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(139,115,85,0.1)]'
                }
                disabled:bg-gray-50 disabled:cursor-not-allowed
              `}
            />
          </div>
          {errors.email && touched.email && (
            <p className="mt-2 text-[var(--color-error)]">{errors.email}</p>
          )}
        </div>

        {/* Campo Password */}
        <div>
          <label htmlFor="password" className="block mb-2 text-[var(--color-text)]">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              <Lock size={20} strokeWidth={1.5} />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) {
                  setErrors({ ...errors, password: validatePassword(e.target.value) });
                }
              }}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              disabled={isLoading}
              className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all duration-200 outline-none
                ${errors.password && touched.password
                  ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(198,123,123,0.1)]' 
                  : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(139,115,85,0.1)]'
                }
                disabled:bg-gray-50 disabled:cursor-not-allowed
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
            </button>
          </div>
          {errors.password && touched.password && (
            <p className="mt-2 text-[var(--color-error)]">{errors.password}</p>
          )}
        </div>

        {/* Remember me y forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors">
              Recordar mi sesión
            </span>
          </label>
          
          <button
            type="button"
            onClick={onSwitchToRecover}
            disabled={isLoading}
            className="text-[var(--color-primary)] hover:underline transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-[#775F45] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Ingresando...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </button>

        {/* Footer info */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-[var(--color-text-secondary)]">
            Sistema de gestión exclusivo para personal de Bio Plasma
          </p>
          <p className="text-[var(--color-text-secondary)]">
            © 2025 Bio Plasma. Todos los derechos reservados.
          </p>
        </div>
      </form>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
