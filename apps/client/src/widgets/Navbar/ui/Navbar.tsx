'use client';

import Link from 'next/link';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import styles from './Navbar.module.scss';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/films" className={styles.logo}>
            Movies Platform
          </Link>
        </div>

        <div className={styles.menu}>
          <Link href="/films" className={styles.link}>
            Фильмы
          </Link>
          <Link href="/genres" className={styles.link}>
            Жанры
          </Link>
          <Link href="/countries" className={styles.link}>
            Страны
          </Link>
          <Link href="/persons" className={styles.link}>
            Персоны
          </Link>
          <Link href="/professions" className={styles.link}>
            Профессии
          </Link>
          <Link href="/debug" className={styles.link}>
            Debug
          </Link>
        </div>

        <div className={styles.user}>
          <span className={styles.userName}>
            {user?.email}
          </span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        </div>
      </div>
    </nav>
  );
};
