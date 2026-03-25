import type { TProfessionItemResponse } from '@common/types';

import type { RefObject, MouseEvent } from 'react';

import { useRef, useEffect, useState, useCallback } from 'react';

type UseScrollArrowsResult = {
  containerRef: RefObject<HTMLDivElement>;
  tabsRef: RefObject<HTMLDivElement>;
  showLeft: boolean;
  showRight: boolean;
  hoverLeft: boolean;
  hoverRight: boolean;
  onMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
  scrollLeft: () => void;
  scrollRight: () => void;
  scrollToActive: () => void;
};

/**
 * Хук для управления горизонтальной прокруткой табов и отображением стрелок.
 * Отслеживает возможность скролла, положение активного элемента,
 * а также зону ховера слева/справа для показа стрелок.
 *
 * @param {TProfessionItemResponse[]} professions — список профессий, отображаемых в табах.
 * @param {number | null} activeProfessionId — id активной профессии, для которой нужно прокрутить табы.
 *
 * @returns {UseScrollArrowsResult} Набор ссылок, состояний и обработчиков
 * для управления стрелками и поведением прокрутки.
 *
 * @property {React.RefObject<HTMLDivElement>} containerRef — внешний контейнер, который отслеживает движение мыши.
 * @property {React.RefObject<HTMLDivElement>} tabsRef — область с табами, которую можно прокручивать.
 * @property {boolean} showLeft — можно ли прокрутить влево.
 * @property {boolean} showRight — можно ли прокрутить вправо.
 * @property {boolean} hoverLeft — находится ли курсор в левой активной зоне.
 * @property {boolean} hoverRight — находится ли курсор в правой активной зоне.
 * @property {(e: React.MouseEvent<HTMLDivElement>) => void} onMouseMove — обработчик движения мыши внутри контейнера.
 * @property {() => void} onMouseLeave — сбрасывает состояния наведения при уходе курсора.
 * @property {() => void} scrollLeft — прокрутка табов влево.
 * @property {() => void} scrollRight — прокрутка табов вправо.
 * @property {() => void} scrollToActive — автоматическая прокрутка к активному табу.
 */
export const useScrollArrows = (
  professions: TProfessionItemResponse[],
  activeProfessionId: number | null
): UseScrollArrowsResult => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [hoverLeft, setHoverLeft] = useState(false);
  const [hoverRight, setHoverRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = tabsRef.current;
    if (!el) {
      setShowLeft(false);
      setShowRight(false);
      return;
    }

    requestAnimationFrame(() => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const canScroll = scrollWidth > clientWidth;
      const tolerance = 1;

      setShowLeft(canScroll && scrollLeft > tolerance);
      setShowRight(canScroll && scrollLeft < scrollWidth - clientWidth - tolerance);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateScrollState, 0);
    const tabsEl = tabsRef.current;
    tabsEl?.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    return () => {
      clearTimeout(timer);
      tabsEl?.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [professions, updateScrollState]);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [professions, updateScrollState]);

  const scrollLeft = () => tabsRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  const scrollRight = () => tabsRef.current?.scrollBy({ left: 200, behavior: 'smooth' });

  const scrollToActive = () => {
    const el = tabsRef.current;
    if (!el || activeProfessionId === null) return;

    const idx = professions.findIndex((p) => p.id === activeProfessionId);
    if (idx === -1) return;

    const btn = el.children[idx] as HTMLElement | undefined;
    if (!btn) return;

    const containerWidth = el.clientWidth;
    const target = btn.offsetLeft - containerWidth / 2 + btn.offsetWidth / 2;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToActive();
    // intentionally not depending on function identity of scrollToActive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProfessionId, professions]);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const cEl = containerRef.current;
    if (!cEl) return;

    // on touch devices we not rely on hover zones
    if (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0)
    ) {
      setHoverLeft(false);
      setHoverRight(false);
      return;
    }

    const rect = cEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const edgeThreshold = 80;

    setHoverLeft(x < edgeThreshold && showLeft);
    setHoverRight(x > width - edgeThreshold && showRight);
  };

  const onMouseLeave = () => {
    setHoverLeft(false);
    setHoverRight(false);
  };

  return {
    containerRef,
    tabsRef,
    showLeft,
    showRight,
    hoverLeft,
    hoverRight,
    onMouseMove,
    onMouseLeave,
    scrollLeft,
    scrollRight,
    scrollToActive,
  };
};
