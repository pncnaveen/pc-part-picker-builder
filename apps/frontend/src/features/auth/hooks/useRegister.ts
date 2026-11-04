import { useCallback, useState } from 'react';

import { fetchRegister } from '../../../api/auth/fetch-register';
import type { RegisterFormPhase } from '../types';

export function useRegister() {
  const [phase, setPhase] = useState<RegisterFormPhase>({ phase: 'idle' });

  const submit = useCallback(async (email: string, password: string) => {
    setPhase({ phase: 'submitting' });
    const result = await fetchRegister({ email, password });

    if (result.kind === 'success') {
      setPhase({ phase: 'success', message: result.response.message });
      return;
    }

    if (result.kind === 'field_error') {
      setPhase({
        phase: 'error',
        emailError: result.field === 'email' ? result.message : undefined,
        passwordError: result.field === 'password' ? result.message : undefined,
      });
      return;
    }

    setPhase({ phase: 'error', bannerError: result.message });
  }, []);

  return { phase, submit };
}
