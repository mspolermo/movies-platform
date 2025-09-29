'use client';

import React, { useEffect } from 'react';
import cn from 'classnames';
import styles from './Overlay.module.scss';

interface OverlayProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	className?: string; // класс для корня-оверлея
	contentClassName?: string; // класс для внутреннего контейнера
	closeOnEsc?: boolean;
	closeOnBackdrop?: boolean;
}

export const Overlay: React.FC<OverlayProps> = ({
	isOpen,
	onClose,
	children,
	className,
	contentClassName,
	closeOnEsc = true,
	closeOnBackdrop = true,
}) => {
	useEffect(() => {
		if (!isOpen || !closeOnEsc) return;
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};
		document.addEventListener('keydown', handleEscape);
		return () => {
			document.removeEventListener('keydown', handleEscape);
		};
	}, [isOpen, closeOnEsc, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className={cn(styles.overlay, className)}
			onClick={closeOnBackdrop ? onClose : undefined}
			role="presentation"
		>
			<div
				className={cn(styles.content, contentClassName)}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};
