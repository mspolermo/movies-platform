import { LoginForm } from '@/features/auth';
import { Page } from '@/widgets/Layout';

export const LoginPage = () => {
  return (
    <Page title="Авторизация">
      <LoginForm />
    </Page>
  );
};
