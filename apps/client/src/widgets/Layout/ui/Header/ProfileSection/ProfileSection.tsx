import styles from './ProfileSection.module.scss';

export const ProfileSection = () => {
  return (
    <div className={styles.container}>
      <p className={styles.placeholder}>
        Вход через API на клиенте отключён. Данные аккаунта недоступны.
      </p>
    </div>
  );
};
