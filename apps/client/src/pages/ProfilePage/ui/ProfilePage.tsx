'use client';

import { Layout } from '@/widgets/Layout';
import { useAuthStore } from '@/features/auth/store';
import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <Layout>
        <div className={styles.error}>Пользователь не найден</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Профиль</h1>
        
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>
                {user.name || user.email}
              </h2>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          
          {user.roles && user.roles.length > 0 && (
            <div className={styles.rolesSection}>
              <h3 className={styles.rolesTitle}>Роли:</h3>
              <div className={styles.rolesList}>
                {user.roles.map((role) => (
                  <span key={role.id} className={styles.role}>
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
