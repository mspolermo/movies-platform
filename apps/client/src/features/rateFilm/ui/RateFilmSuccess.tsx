import styles from './RateFilmSuccess.module.scss';

/**
 * Экран подтверждения после выставления оценки.
 * Галочка — декоративный background (не SvgIcon: у него глобальный hover/cursor).
 */
export const RateFilmSuccess = () => {
  return (
    <div className={styles.root}>
      <div aria-hidden className={styles.icon} />
      <p className={styles.text}>Спасибо, что поделились своим мнением</p>
    </div>
  );
};
