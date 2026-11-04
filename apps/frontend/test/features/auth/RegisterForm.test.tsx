import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { RegisterForm } from '../../../src/features/auth/components/RegisterForm';

describe('RegisterForm', () => {
  it('shows password helper and sign-in link', () => {
    render(
      <MemoryRouter>
        <RegisterForm phase={{ phase: 'idle' }} onSubmit={() => undefined} />
      </MemoryRouter>,
    );

    expect(screen.getByText('8–12 characters, no spaces.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
  });
});
