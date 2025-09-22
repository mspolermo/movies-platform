'use client';

import React from 'react';
import { SvgIcon } from '../../../../shared/ui/SvgIcon';
import styles from './HeaderUser.module.scss';

export const HeaderUser: React.FC = () => {
  const isAuthenticated = false; // TODO: Получать из контекста/состояния

  return (
    <div className={styles.user}>
      <div className={styles.actions}>
        <button
          className={styles.profile}
          onClick={() => window.open('/auth/login', '_self')}
        >
          <div className={styles.profileBorder}>
            <SvgIcon 
              name={isAuthenticated ? "personFull" : "person"} 
              className={styles.icon}
              size={20}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
