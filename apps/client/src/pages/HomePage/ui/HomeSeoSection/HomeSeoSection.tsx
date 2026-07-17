'use client';

import cn from 'classnames';
import { useId, useState } from 'react';

import styles from './HomeSeoSection.module.scss';

/** SEO-секция главной: свёрнутый текст с раскрытием. */
export const HomeSeoSection = () => {
  const titleId = useId();
  const bodyId = useId();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <section aria-labelledby={titleId} className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title} id={titleId}>
          MovieLand — каталог фильмов: информация, жанры, рейтинги и отзывы
        </h2>

        <div className={cn(styles.body, !isExpanded && styles.collapsed)} id={bodyId}>
          <p className={styles.paragraph}>
            MovieLand — платформа о кино: карточки фильмов, жанры, страны, актёры и режиссёры,
            пользовательские рейтинги и комментарии. Ищете, что посмотреть, или хотите быстро найти
            факты о ленте — начните с каталога.
          </p>
          <p className={styles.paragraph}>
            В базе — тысячи фильмов с описаниями, постерами, рейтингами Кинопоиска и подборками по
            жанрам. Новые разделы и фильтры появляются по мере развития сервиса.
          </p>
          <p className={styles.paragraph}>На MovieLand можно:</p>

          <ul className={styles.features}>
            <li className={styles.feature}>
              просматривать карточки фильмов с описанием, годом, длительностью и рейтингами;
            </li>
            <li className={styles.feature}>
              фильтровать и искать по жанрам, странам и другим параметрам;
            </li>
            <li className={styles.feature}>смотреть подборки похожих фильмов на странице ленты;</li>
            <li className={styles.feature}>
              изучать создателей — актёров, режиссёров и другие профессии;
            </li>
            <li className={styles.feature}>читать и оставлять комментарии к фильмам;</li>
            <li className={styles.feature}>
              оценивать фильмы и ориентироваться на рейтинги сообщества;
            </li>
            <li className={styles.feature}>переходить к персонам и их фильмографии.</li>
          </ul>

          <p className={styles.paragraph}>
            Откройте каталог MovieLand и найдите фильм, который стоит вашего времени.
          </p>
        </div>

        <button
          aria-controls={bodyId}
          aria-expanded={isExpanded}
          className={styles.toggle}
          type="button"
          onClick={handleToggle}
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
        </button>
      </div>
    </section>
  );
};
