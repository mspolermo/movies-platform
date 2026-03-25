'use client';

import type { FormEvent, ChangeEvent } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Input } from '@/shared/ui';

import styles from './RegisterForm.module.scss';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Демо: регистрация на сервер не отправляется
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <h1>✅ Форма отправлена (демо)</h1>
          <p>Регистрация на сервер не выполняется. Перенаправление на страницу входа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Регистрация</h1>

      <p className={styles.demoNote}>Данные не передаются на сервер — только демонстрация формы.</p>

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
          <Link className={styles.link} href="/auth/login">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};
