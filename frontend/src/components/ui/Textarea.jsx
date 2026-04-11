import React from 'react';
import { twMerge } from 'tailwind-merge';
const Textarea = ({ className, ...props }) => (<textarea {...props} className={twMerge('hms-input min-h-[100px] resize-none', className)}/>);
export default Textarea;
