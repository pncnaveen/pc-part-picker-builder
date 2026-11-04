import { RegisterForm } from '../components/RegisterForm';
import { useRegister } from '../hooks/useRegister';

export function RegisterPage() {
  const { phase, submit } = useRegister();

  return (
    <main>
      <RegisterForm
        phase={phase}
        onSubmit={(email, password) => {
          void submit(email, password);
        }}
      />
    </main>
  );
}
