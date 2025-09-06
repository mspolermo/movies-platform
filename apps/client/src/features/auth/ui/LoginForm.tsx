'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../api/authStore/store';
import styles from './LoginForm.module.scss';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    console.log('LoginForm: Submitting form with:', { email, password });

    try {
      await login({ email, password });
      console.log('LoginForm: Login successful, redirecting to /films');
      router.push('/films');
    } catch (error) {
      console.error('LoginForm: Login failed:', error);
      // Ошибка уже обработана в store
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Вход в систему</h1>
      
      <div className={styles.testInfo}>
        <h3>Тестовые данные:</h3>
        <p><strong>Email:</strong> user@example.com</p>
        <p><strong>Password:</strong> password123</p>
        <p><em>Или создайте нового пользователя через регистрацию</em></p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
            disabled={isLoading}
            placeholder="user@example.com"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            disabled={isLoading}
            placeholder="password123"
          />
        </div>

        {error && (
          <div className={styles.error}>
            <strong>Ошибка входа:</strong> {error}
            <br />
            <small>Проверьте правильность email и пароля</small>
          </div>
        )}

        <button
          type="submit"
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>

      <div className={styles.registerLink}>
        <p>
          Нет аккаунта?{' '}
          <Link href="/auth/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
};
