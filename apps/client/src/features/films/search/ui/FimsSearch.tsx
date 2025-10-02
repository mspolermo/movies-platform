'use client';

import React, { useState } from 'react';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import { Input } from '@/shared/ui/Input';
import { Overlay } from '@/shared/ui';
import styles from './FimsSearch.module.scss';
import { FilmsSearchProps } from './types';


export const FimsSearch = (props: FilmsSearchProps) => {
  const { isOpen, handleClose } = props
	return (
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
	);
};
