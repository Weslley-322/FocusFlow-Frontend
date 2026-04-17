import { ReactNode } from "react";

interface CardProps { 
    children: ReactNode; 
    title?: string; 
    className?: string; 
    padding?: 'none'|'sm'|'md'|'lg'; onClick?: () => void; 
}

export function Card({ children, title, className='', padding='md', onClick }: CardProps) {
  
  const paddings = { none:'p-0', sm:'p-3', md:'p-6', lg:'p-8' };

  const clickableClass = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : '';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${paddings[padding]} ${clickableClass} ${className}`} onClick={onClick}>
      {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>}
      {children}
    </div>
  );
}