import type { TErrorPageProps } from './types';

import { Button } from '@/shared/ui';
import { Page } from '@/widgets/Layout';

import styles from './ErrorPage.module.scss';

/**
 * Страница ошибки (500 / runtime error)
 */
export const ErrorPage = ({
  description = 'Что-то пошло не так. Попробуйте ещё раз',
  error,
  onRetry,
}: TErrorPageProps) => {
  console.warn(error);

  return (
    <Page title="Произошла ошибка">
      <div className={styles.container}>
        <h1 className={styles.title}>500</h1>

        <p className={styles.description}>{description}</p>

        {onRetry && (
          <Button className={styles.button} onClick={onRetry}>
            Попробовать снова
          </Button>
        )}
      </div>
    </Page>
  );
};
