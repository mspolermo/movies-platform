import { useAuthStore } from '@/features/auth';
import styles from './ProfileSection.module.scss';
import { Button } from '@/shared/ui';

export const ProfileSection = ({onClose}: {onClose: () => void;}) => {
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
        <div className={styles.error}>Вы не автроризированы! Войдите на сайт</div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user.name || user.email}</h2>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        {user.roles && user.roles.length > 0 && (
          <div className={styles.rolesSection}>
            <h3 className={styles.rolesTitle}>Роли:</h3>
            <div className={styles.rolesList}>
              {user.roles.map((role) => (
                <span key={role.id} className={styles.role}>
                  {role.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Button onClick={() => logout()}>Выйти из профиля</Button>
    </div>
  );
};