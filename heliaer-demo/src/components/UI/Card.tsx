import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  padding = 'md',
  onClick
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden';
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover 
    ? 'transition-all duration-200 hover:shadow-xl hover:-translate-y-1' 
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const cardClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${hoverClasses}
    ${clickableClasses}
    ${className}
  `.trim();

  const CardComponent = onClick ? motion.div : 'div';

  return (
    <CardComponent
      className={cardClasses}
      onClick={onClick}
      {...(onClick && {
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 }
      })}
    >
      {children}
    </CardComponent>
  );
};

export default Card;