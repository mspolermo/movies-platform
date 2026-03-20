import type { TNotFoundPageProps } from './types';
import styles from "./NotFoundPage.module.scss";
import { Layout } from '@/widgets/Layout';

/**
 * Cтраница 404
 */
export const NotFoundPage = ({
  description = 'К сожалению, по вашему запросу ничего не найдено'
}: TNotFoundPageProps) => {
  return (
    <Layout title="Страница не найдена">
      <div className={styles.container}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>{description}</p>
      </div>
    </Layout>
);
};
