'use client';

import { useRef, useState } from 'react';

/** Общее состояние модалок и списка для админских CRUD-панелей (создание/редактирование/удаление). */
export const useAdminCrudPanel = <T extends { id: number }>() => {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingRef = useRef(false);
  const formSessionRef = useRef(0);
  const deleteSessionRef = useRef(0);

  const bumpFormSession = () => {
    formSessionRef.current += 1;
  };

  const openCreate = () => {
    bumpFormSession();
    setCreating(true);
    setEditing(null);
    setError(null);
  };

  const openEdit = (item: T) => {
    bumpFormSession();
    setCreating(false);
    setEditing(item);
    setError(null);
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
    setError(null);
  };

  /** Закрытие формы: ничего не делает во время ожидания (pending). */
  const requestCloseForm = () => {
    if (pendingRef.current) return;
    closeForm();
  };

  const requestDelete = (item: T) => {
    deleteSessionRef.current += 1;
    setDeleting(item);
    setError(null);
  };

  const cancelDelete = () => {
    setDeleting(null);
  };

  /** Закрытие модалки удаления: ничего не делает во время ожидания (pending). */
  const requestCancelDelete = () => {
    if (pendingRef.current) return;
    cancelDelete();
  };

  /**
   * Выполняет асинхронное действие под флагом ожидания (pending).
   * Возвращает true только при успехе, если сессия формы/удаления не сменилась.
   */
  const runPending = async (
    action: () => Promise<void>,
    options?: { scope?: 'form' | 'delete'; errorMessage?: string }
  ): Promise<boolean> => {
    const scope = options?.scope ?? 'form';
    const session = scope === 'delete' ? deleteSessionRef.current : formSessionRef.current;

    pendingRef.current = true;
    setPending(true);
    setError(null);

    try {
      await action();
      const sessionMatches =
        scope === 'delete'
          ? session === deleteSessionRef.current
          : session === formSessionRef.current;
      return sessionMatches;
    } catch {
      setError(options?.errorMessage ?? 'Не удалось выполнить действие');
      return false;
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  return {
    query,
    setQuery,
    creating,
    editing,
    deleting,
    pending,
    error,
    setError,
    isFormOpen: creating || editing != null,
    openCreate,
    openEdit,
    closeForm,
    requestCloseForm,
    requestDelete,
    cancelDelete,
    requestCancelDelete,
    runPending,
  };
};
