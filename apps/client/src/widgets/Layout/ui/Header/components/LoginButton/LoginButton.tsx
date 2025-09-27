'use client';

import { SvgIcon } from '@/shared/ui/SvgIcon';
import { useAuthStore } from '@/features/auth';
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

  return (
    <div className={styles.user}>
      <div className={styles.actions}>
        {isAuthenticated && user && (
          <span className={styles.userEmail}>{user.email}</span>
        )}
        <button
          className={styles.profile}
          onClick={handleAuthClick}
          title={isAuthenticated ? 'Выйти' : 'Войти'}
        >
          <div className={styles.profileBorder}>
            <SvgIcon 
              name={isAuthenticated ? "personFull" : "person"} 
              className={styles.icon}
              size={20}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
