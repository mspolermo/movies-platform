'use client';

import type { FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createFilmComment } from '@/entities/comment';
import { hasToken } from '@/shared/lib/auth';
import { Button, Input } from '@/shared/ui';

import styles from './CreateReviewForm.module.scss';

type TCreateReviewFormProps = {
  filmId: number;
  onCancel: () => void;
  onSuccess: () => void;
};

//TODO: выглядит так как будто надо в отдельную фичу вытащить работу с формами создания комментов

export const CreateReviewForm = ({ filmId, onCancel, onSuccess }: TCreateReviewFormProps) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!hasToken()) {
      router.push('/auth/login');
      return;
    }

    if (!title.trim() || !text.trim()) {
      setError('Заполните заголовок и текст отзыва');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createFilmComment(filmId, {
        title: title.trim(),
        text: text.trim(),
      });
      setTitle('');
      setText('');
      onSuccess();
    } catch {
      setError('Не удалось отправить отзыв');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        disabled={isSubmitting}
        label="Заголовок"
        placeholder="Заголовок отзыва"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <Input
        disabled={isSubmitting}
        label="Текст отзыва"
        placeholder="Ваш отзыв о фильме"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <Button disabled={isSubmitting} type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button disabled={isSubmitting} loading={isSubmitting} type="submit" variant="red">
          Опубликовать
        </Button>
      </div>
    </form>
  );
};
