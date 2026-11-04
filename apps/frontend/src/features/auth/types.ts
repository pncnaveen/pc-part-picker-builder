export type RegisterFormPhase =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'success'; message: string }
  | {
      phase: 'error';
      emailError?: string;
      passwordError?: string;
      bannerError?: string;
    };
