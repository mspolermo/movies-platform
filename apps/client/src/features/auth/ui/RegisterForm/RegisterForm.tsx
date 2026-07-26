'use client';

import type { FormEvent, ChangeEvent } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { registerUser } from '@/shared/api';
import { AUTH_LOGIN_PATH } from '@/shared/api/session';
import { Button, Input } from '@/shared/ui';

import styles from './RegisterForm.module.scss';
import { resolveAuthReturnUrl, applyAuthResponse } from '../../lib';

export const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const returnUrl = searchParams?.get('returnUrl');
  const loginHref = returnUrl
    ? `${AUTH_LOGIN_PATH}?returnUrl=${encodeURIComponent(returnUrl)}`
    : AUTH_LOGIN_PATH;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      });
      applyAuthResponse(response);
      router.push(resolveAuthReturnUrl(returnUrl));
    } catch {
      setError('Не удалось зарегистрироваться. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Регистрация</h1>

      {error && <div className={styles.testInfo}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          required
          disabled={loading}
          label="Имя"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          required
          disabled={loading}
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          required
          disabled={loading}
          label="Пароль"
          minLength={6}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button disabled={loading} loading={loading} type="submit" variant="red">
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>

      <div className={styles.loginLink}>
        <p>
          Уже есть аккаунт?{' '}
          <Link className={styles.link} href={loginHref}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};
