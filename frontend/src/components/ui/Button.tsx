import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
  const base = size === 'sm' ? 'hms-btn-sm' : 'hms-btn';
  const variantClass =
    variant === 'danger'  ? 'hms-btn-danger' :
    variant === 'outline' ? 'hms-btn-outline' :
    variant === 'ghost'   ? 'hms-btn-ghost' :
    'hms-btn-primary';

  return (
    <button
      className={twMerge(base, variantClass, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;