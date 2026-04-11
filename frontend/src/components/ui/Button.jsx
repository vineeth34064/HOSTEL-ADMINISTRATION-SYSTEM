import React from 'react';
import { twMerge } from 'tailwind-merge';
const Button = ({ children, className, variant = 'primary', size = 'md', ...props }) => {
    const base = size === 'sm' ? 'hms-btn-sm' : 'hms-btn';
    const variantClass = variant === 'danger' ? 'hms-btn-danger' :
        variant === 'outline' ? 'hms-btn-outline' :
            variant === 'ghost' ? 'hms-btn-ghost' :
                'hms-btn-primary';
    return (<button className={twMerge(base, variantClass, className)} {...props}>
      {children}
    </button>);
};
export default Button;
