import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, title, subtitle, action }) => {
  return (
    <div className={twMerge('hms-card', className)}>
      {(title || action) && (
        <div className="hms-card-header">
          <div>
            {title && <div className="hms-card-title">{title}</div>}
            {subtitle && <div className="hms-card-sub">{subtitle}</div>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={title ? 'hms-card-body' : 'p-5'}>
        {children}
      </div>
    </div>
  );
};

export default Card;