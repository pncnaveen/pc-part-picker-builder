import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <form
      className="space-y-6"
      onSubmit={handleSubmit}
      aria-labelledby="register-heading"
      noValidate
    >
      <div className="space-y-1">
        <h1 id="register-heading" className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Register with email and password. You will verify your email before saving builds.
        </p>
      </div>

      {isSuccess && phase.phase === 'success' ? (
        <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm" role="status">
          {phase.message}
        </p>
      ) : null}

      {errors?.bannerError ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {errors.bannerError}
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
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
          <p id="register-email-error" className="text-sm text-destructive" role="alert">
            {errors.emailError}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
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
        <p id="register-password-helper" className="text-sm text-muted-foreground">
          8–12 characters, no spaces.
        </p>
        {errors?.passwordError ? (
          <p id="register-password-error" className="text-sm text-destructive" role="alert">
            {errors.passwordError}
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || isSuccess}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>

      <p className="text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
