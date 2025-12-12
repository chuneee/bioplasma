import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

interface RecoverPasswordProps {
  onBack: () => void;
}

export function RecoverPassword({ onBack }: RecoverPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El correo electrónico es requerido';
    if (!emailRegex.test(email)) return 'Ingresa un correo electrónico válido';
    return '';
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateEmail(email);
    setError(validationError);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateEmail(email);
    setTouched(true);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulación de envío de email
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle size={40} className="text-[var(--color-success)]" strokeWidth={1.5} />
            </div>
          </div>
          
          <h2 className="mb-3">¡Listo!</h2>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Revisa tu bandeja de entrada. Te hemos enviado las instrucciones para restablecer tu contraseña.
          </p>

          <button
            onClick={onBack}
            className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-[#775F45] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-[var(--color-primary)] hover:underline transition-all group"
      >
        <ArrowLeft size={20} strokeWidth={1.5} className="group-hover:-translate-x-1 transition-transform" />
        Volver al inicio de sesión
      </button>

      <div className="mb-8">
        <h2 className="mb-2">Recuperar contraseña</h2>
        <p className="text-[var(--color-text-secondary)]">
          Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="recover-email" className="block mb-2 text-[var(--color-text)]">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <input
              id="recover-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched) {
                  setError(validateEmail(e.target.value));
                }
              }}
              onBlur={handleBlur}
              placeholder="ejemplo@bioplasma.com"
              disabled={isLoading}
              className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 outline-none
                ${error && touched
                  ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:shadow-[0_0_0_3px_rgba(198,123,123,0.1)]' 
                  : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:shadow-[0_0_0_3px_rgba(139,115,85,0.1)]'
                }
                disabled:bg-gray-50 disabled:cursor-not-allowed
              `}
            />
          </div>
          {error && touched && (
            <p className="mt-2 text-[var(--color-error)]">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-[#775F45] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar instrucciones'
          )}
        </button>

        <div className="text-center pt-4">
          <p className="text-[var(--color-text-secondary)]">
            © 2025 Bio Plasma. Todos los derechos reservados.
          </p>
        </div>
      </form>
    </div>
  );
}
