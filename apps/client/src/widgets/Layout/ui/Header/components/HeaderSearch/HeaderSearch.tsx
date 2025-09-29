'use client';

import React, { useState } from 'react';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import { Input } from '@/shared/ui/Input';
import { Overlay } from '@/shared/ui';
import styles from './HeaderSearch.module.scss';

//TODO: переделать

export const HeaderSearch = () => {
	const [isOpen, setIsOpen] = useState(false);

	const handleToggle = () => {
		setIsOpen(!isOpen);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<div className={styles.search}>
			<button
				className={styles.button}
				onClick={handleToggle}
				data-testid="headerSearch"
			>
				<SvgIcon 
					name="search" 
					className={styles.icon}
					size={20}
				/>
				<span className={styles.text}>Поиск</span>
			</button>
			
			<Overlay isOpen={isOpen} onClose={handleClose}>
				<Input
					placeholder="Поиск фильмов, сериалов, мультфильмов..."
					className={styles.input}
					autoFocus
				/>
				<button
					className={styles.close}
					onClick={handleClose}
				>
					<SvgIcon name="close" size={24} />
				</button>
			</Overlay>
		</div>
	);
};
