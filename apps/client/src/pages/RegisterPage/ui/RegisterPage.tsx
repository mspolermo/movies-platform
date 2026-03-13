'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import { Button, Input } from '@/shared/ui';
import styles from './RegisterPage.module.scss';


//TODO: форму вынести, сделать обертку чтоб форма была по центру экрана общую и для страницы логина
export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient.post(API_ENDPOINTS.AUTH.REGISTRATION, formData);
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.success}>
          <h1>✅ Регистрация успешна!</h1>
          <p>Пользователь создан. Перенаправление на страницу входа...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Регистрация</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Имя"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <Input
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
          minLength={6}
        />

        <Button
          type="submit"
          variant="red"
          disabled={loading}
          loading={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </form>

      <div className={styles.loginLink}>
        <p>
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className={styles.link}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};
