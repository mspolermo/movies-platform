'use client';

import React from 'react';
import { SvgIcon } from '../../../shared/ui/SvgIcon';
import styles from './HeaderUser.module.scss';

export const HeaderUser: React.FC = () => {
  const isAuthenticated = false; // TODO: Получать из контекста/состояния

  return (
    <div className={styles.user}>
      <div className={styles.actions}>
        <button
          className={styles.notification}
          onClick={() => window.open('https://www.ivi.ru/profile/pull_notifications', '_blank')}
        >
          <SvgIcon 
            name="notification" 
            className={styles.icon}
            size={16}
          />
        </button>
        
        <button
          className={styles.profile}
          onClick={() => window.open('/auth', '_self')}
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
