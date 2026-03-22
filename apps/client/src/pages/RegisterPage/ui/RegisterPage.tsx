import { RegisterForm } from '@/features/auth';
import { Page } from '@/widgets/Layout';

export const RegisterPage = () => {
  return (
    <Page title="Регистрация">
      <RegisterForm />
    </Page>
  );
};
