'use client';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function useAuthState() {
  const clerk = useClerk();
  const { isSignedIn: initialIsSignedIn } = useAuth();
  const [isSignedIn, setIsSignedIn] = useState(initialIsSignedIn);

  useEffect(() => {
    // Validar el estado actual de la sesión
    const validateAuth = () => {
      setIsSignedIn(!!clerk.user);
    };

    validateAuth();

    // Re-validar cuando vuelves con el botón atrás
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        validateAuth();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [clerk.user]);

  return { isSignedIn };
}
