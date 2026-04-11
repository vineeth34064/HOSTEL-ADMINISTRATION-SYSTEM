import React from 'react';
import { twMerge } from 'tailwind-merge';

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea
    {...props}
    className={twMerge('hms-input min-h-[100px] resize-none', className)}
  />
);

export default Textarea;