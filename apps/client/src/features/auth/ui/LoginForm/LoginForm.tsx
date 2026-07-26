'use client';

import type { FormEvent, ChangeEvent } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { loginUser } from '@/shared/api';
import { Button, Input } from '@/shared/ui';

import styles from './LoginForm.module.scss';
import { resolveAuthReturnUrl } from '../../lib';
import { applyAuthResponse } from '../../model';

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      applyAuthResponse(response);
      router.push(resolveAuthReturnUrl(searchParams?.get('returnUrl')));
    } catch {
      setError('Не удалось войти. Проверьте email и пароль.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вход в систему</h1>

      {error && <div className={styles.testInfo}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          required
          disabled={isLoading}
          label="Email"
          placeholder="user@example.com"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />

        <Input
          required
          disabled={isLoading}
          label="Пароль"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />

        <Button disabled={isLoading} loading={isLoading} type="submit" variant="red">
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
