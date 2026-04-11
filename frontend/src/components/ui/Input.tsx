import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    {...props}
    className={twMerge('hms-input', className)}
  />
);

export default Input;