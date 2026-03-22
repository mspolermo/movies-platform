import type { TNotFoundPageProps } from './types';

import { Page } from '@/widgets/Layout';

import styles from './NotFoundPage.module.scss';

/**
 * Cтраница 404
 */
export const NotFoundPage = ({
  description = 'К сожалению, по вашему запросу ничего не найдено',
}: TNotFoundPageProps) => {
  return (
    <Page title="Страница не найдена">
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>{description}</p>
      </div>
    </Page>
  );
};
