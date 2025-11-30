'use client';

import { SvgIcon } from '@/shared/ui/SvgIcon';
import { useAuthStore } from '@/features/auth';
import Link from 'next/link';
import styles from './LoginButton.module.scss';

export const LoginButton = () => {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      window.open('/auth/login', '_self');
    }
  };

  const handleProfileClick = () => {

  }

  return (
    <div className={styles.user}>
      <div className={styles.actions}>
        {isAuthenticated && user && (            <Link href="/profile" className={styles.userEmail}>
          <span className={styles.link}>{user.email} </span>
            </Link>
          
        )}
        <button
          className={styles.profile}
          onClick={handleAuthClick}
          title={isAuthenticated ? 'Выйти' : 'Войти'}
        >
          <div className={styles.profileBorder}>
            <SvgIcon
              name={isAuthenticated ? 'personFull' : 'person'}
              className={styles.icon}
              size={20}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
