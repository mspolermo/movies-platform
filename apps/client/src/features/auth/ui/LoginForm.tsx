'use client';

import type { FormEvent, ChangeEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Input } from '@/shared/ui';

import styles from './LoginForm.module.scss';
import { useAuthStore } from '../api';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    console.info('LoginForm: Submitting form with:', { email, password });

    try {
      await login({ email, password });
      console.info('LoginForm: Login successful, redirecting to /films');
      router.push('/films');
    } catch (error) {
      console.error('LoginForm: Login failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вход в систему</h1>

      <div className={styles.testInfo}>
        <h3>Тестовые данные:</h3>
        <p>
          <strong>Email:</strong> user@example.com
        </p>
        <p>
          <strong>Password:</strong> password123
        </p>
        <p>
          <em>Или создайте нового пользователя через регистрацию</em>
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          required
          disabled={isLoading}
          error={error ? 'Проверьте правильность email и пароля' : undefined}
          label="Email"
          placeholder="user@example.com"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />

        <Input
          required
          disabled={isLoading}
          label="Пароль"
          placeholder="password123"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />

        <Button
          disabled={isLoading}
          loading={isLoading}
          type="submit"
          variant="red"
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <div className={styles.registerLink}>
        <p>
          Нет аккаунта?{' '}
          <Link className={styles.link} href="/auth/register">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
};
