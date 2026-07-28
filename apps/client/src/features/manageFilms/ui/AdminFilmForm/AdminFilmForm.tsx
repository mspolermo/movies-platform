'use client';

import type { TAdminFilmFormProps } from './types';
import type { TAdminFilmItemResponse, TCreateFilmRequest } from '@common/types';

import type { FormEvent } from 'react';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Input } from '@/shared/ui';

import styles from './AdminFilmForm.module.scss';
import { createFilmStub, updateFilmStub } from '../../api';

const emptyForm = (): TCreateFilmRequest => ({
  filmNameRu: '',
  filmNameEn: '',
  description: '',
  slogan: '',
  year: undefined,
  movieLength: undefined,
  trailerName: '',
  trailerUrl: '',
  bigPictureUrl: '',
  smallPictureUrl: '',
  originalFilmLanguage: '',
  premiereCountry: '',
  premiereWorldDate: '',
  ratingKp: undefined,
  votesKp: undefined,
  ratingImdb: undefined,
  votesImdb: undefined,
  ratingFilmCritics: undefined,
  votesFilmCritics: undefined,
  ratingRussianFilmCritics: undefined,
  votesRussianFilmCritics: undefined,
  top10: undefined,
  top250: undefined,
});

const toForm = (film?: TAdminFilmItemResponse): TCreateFilmRequest => {
  if (!film) return emptyForm();
  const { id: _id, ...rest } = film;
  return { ...emptyForm(), ...rest };
};

const parseOptionalNumber = (value: string): number | undefined => {
  if (value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const optionalString = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

/** Пустые необязательные строки → undefined (под будущий ValidationPipe). */
const toPayload = (form: TCreateFilmRequest): TCreateFilmRequest => ({
  ...form,
  filmNameRu: form.filmNameRu.trim(),
  filmNameEn: optionalString(form.filmNameEn),
  description: optionalString(form.description),
  slogan: optionalString(form.slogan),
  trailerName: optionalString(form.trailerName),
  trailerUrl: optionalString(form.trailerUrl),
  bigPictureUrl: optionalString(form.bigPictureUrl),
  smallPictureUrl: optionalString(form.smallPictureUrl),
  originalFilmLanguage: optionalString(form.originalFilmLanguage),
  premiereCountry: optionalString(form.premiereCountry),
  premiereWorldDate: optionalString(form.premiereWorldDate),
});

/** Форма создания/редактирования скаляров фильма (сохранение в заглушку). */
export const AdminFilmForm = ({ mode, initial }: TAdminFilmFormProps) => {
  const router = useRouter();
  const [form, setForm] = useState<TCreateFilmRequest>(() => toForm(initial));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof TCreateFilmRequest>(key: K, value: TCreateFilmRequest[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  //TODO: почему тип FormEvent?
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.filmNameRu.trim()) {
      setError('Укажите название (RU)');
      return;
    }

    const payload = toPayload(form);

    setPending(true);
    try {
      if (mode === 'create') {
        await createFilmStub(payload);
        router.push('/admin/films');
        return;
      }

      if (!initial) {
        setError('Фильм не найден');
        return;
      }

      const updated = await updateFilmStub(initial.id, payload);
      if (!updated) {
        setError('Фильм не найден');
        return;
      }

      router.push('/admin/films');
    } catch {
      setError('Не удалось сохранить (stub)');
    } finally {
      setPending(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Названия</h2>
        <Input
          required
          label="Название (RU)"
          value={form.filmNameRu}
          onChange={(e) => setField('filmNameRu', e.target.value)}
        />
        <Input
          label="Название (EN)"
          value={form.filmNameEn ?? ''}
          onChange={(e) => setField('filmNameEn', e.target.value)}
        />
        <label className={styles.textareaLabel}>
          Описание
          <textarea
            className={styles.textarea}
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => setField('description', e.target.value)}
          />
        </label>
        <Input
          label="Слоган"
          value={form.slogan ?? ''}
          onChange={(e) => setField('slogan', e.target.value)}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Мета</h2>
        <div className={styles.row}>
          <Input
            label="Год"
            type="number"
            value={form.year ?? ''}
            onChange={(e) => setField('year', parseOptionalNumber(e.target.value))}
          />
          <Input
            label="Длительность (мин)"
            type="number"
            value={form.movieLength ?? ''}
            onChange={(e) => setField('movieLength', parseOptionalNumber(e.target.value))}
          />
        </div>
        <Input
          label="Язык оригинала"
          value={form.originalFilmLanguage ?? ''}
          onChange={(e) => setField('originalFilmLanguage', e.target.value)}
        />
        <Input
          label="Страна премьеры"
          value={form.premiereCountry ?? ''}
          onChange={(e) => setField('premiereCountry', e.target.value)}
        />
        <Input
          label="Дата мировой премьеры (ISO)"
          placeholder="1999-03-31"
          value={form.premiereWorldDate ?? ''}
          onChange={(e) => setField('premiereWorldDate', e.target.value)}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Медиа</h2>
        <Input
          label="Постер (small URL)"
          value={form.smallPictureUrl ?? ''}
          onChange={(e) => setField('smallPictureUrl', e.target.value)}
        />
        <Input
          label="Постер (big URL)"
          value={form.bigPictureUrl ?? ''}
          onChange={(e) => setField('bigPictureUrl', e.target.value)}
        />
        <Input
          label="Трейлер — название"
          value={form.trailerName ?? ''}
          onChange={(e) => setField('trailerName', e.target.value)}
        />
        <Input
          label="Трейлер — URL"
          value={form.trailerUrl ?? ''}
          onChange={(e) => setField('trailerUrl', e.target.value)}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Рейтинги</h2>
        <div className={styles.row}>
          <Input
            label="KP"
            type="number"
            value={form.ratingKp ?? ''}
            onChange={(e) => setField('ratingKp', parseOptionalNumber(e.target.value))}
          />
          <Input
            label="Голоса KP"
            type="number"
            value={form.votesKp ?? ''}
            onChange={(e) => setField('votesKp', parseOptionalNumber(e.target.value))}
          />
          <Input
            label="IMDB"
            type="number"
            value={form.ratingImdb ?? ''}
            onChange={(e) => setField('ratingImdb', parseOptionalNumber(e.target.value))}
          />
          <Input
            label="Голоса IMDB"
            type="number"
            value={form.votesImdb ?? ''}
            onChange={(e) => setField('votesImdb', parseOptionalNumber(e.target.value))}
          />
        </div>
        <div className={styles.row}>
          <Input
            label="Критики"
            type="number"
            value={form.ratingFilmCritics ?? ''}
            onChange={(e) => setField('ratingFilmCritics', parseOptionalNumber(e.target.value))}
          />
          <Input
            label="Голоса критиков"
            type="number"
            value={form.votesFilmCritics ?? ''}
            onChange={(e) => setField('votesFilmCritics', parseOptionalNumber(e.target.value))}
          />
          <Input
            label="Рос. критики"
            type="number"
            value={form.ratingRussianFilmCritics ?? ''}
            onChange={(e) =>
              setField('ratingRussianFilmCritics', parseOptionalNumber(e.target.value))
            }
          />
          <Input
            label="Голоса рос. критиков"
            type="number"
            value={form.votesRussianFilmCritics ?? ''}
            onChange={(e) =>
              setField('votesRussianFilmCritics', parseOptionalNumber(e.target.value))
            }
          />
        </div>
        <div className={styles.row}>
          <Input
            label="Top 10"
            type="number"
            value={form.top10 ?? ''}
            onChange={(e) => setField('top10', parseOptionalNumber(e.target.value))}
          />
          <Input
            label="Top 250"
            type="number"
            value={form.top250 ?? ''}
            onChange={(e) => setField('top250', parseOptionalNumber(e.target.value))}
          />
        </div>
      </section>

      <div className={styles.footer}>
        <Button
          disabled={pending}
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/films')}
        >
          Отмена
        </Button>
        <Button disabled={pending} type="submit">
          {mode === 'create' ? 'Создать' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
};
