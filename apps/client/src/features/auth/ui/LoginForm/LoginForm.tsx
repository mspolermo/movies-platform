'use client';

import type { FormEvent, ChangeEvent } from 'react';

import Link from 'next/link';
import { useState } from 'react';

import { Button, Input } from '@/shared/ui';

import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInfo(null);
    setIsLoading(true);

    // Демо: данные не отправляются на сервер
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);
    setInfo('Вход через API отключён на клиенте. Данные не передаются на сервер.');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вход в систему</h1>

      <p className={styles.testInfo}>
        Форма демонстрационная: запросы авторизации к бэкенду не выполняются.
      </p>

      {info && <div className={styles.testInfo}>{info}</div>}

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
