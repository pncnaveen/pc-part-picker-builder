import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import type { RegisterFormPhase } from '../types';

type RegisterFormProps = {
  phase: RegisterFormPhase;
  onSubmit: (email: string, password: string) => void;
};

export function RegisterForm({ phase, onSubmit }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSubmitting = phase.phase === 'submitting';
  const isSuccess = phase.phase === 'success';
  const errors = phase.phase === 'error' ? phase : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || isSuccess) {
      return;
    }
    onSubmit(email, password);
  }

  return (
    <form onSubmit={handleSubmit} aria-labelledby="register-heading" noValidate>
      <h1 id="register-heading">Create an account</h1>

      {isSuccess && phase.phase === 'success' ? <p role="status">{phase.message}</p> : null}

      {errors?.bannerError ? <p role="alert">{errors.bannerError}</p> : null}

      <div>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          disabled={isSubmitting}
          aria-invalid={errors?.emailError ? true : undefined}
          aria-describedby={errors?.emailError ? 'register-email-error' : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
        {errors?.emailError ? (
          <p id="register-email-error" role="alert">
            {errors.emailError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={12}
          value={password}
          disabled={isSubmitting}
          aria-invalid={errors?.passwordError ? true : undefined}
          aria-describedby="register-password-helper register-password-error"
          onChange={(event) => setPassword(event.target.value)}
        />
        <p id="register-password-helper">8–12 characters, no spaces.</p>
        {errors?.passwordError ? (
          <p id="register-password-error" role="alert">
            {errors.passwordError}
          </p>
        ) : null}
      </div>

      <button type="submit" disabled={isSubmitting || isSuccess}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </button>

      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
