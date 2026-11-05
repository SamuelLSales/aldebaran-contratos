import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-xs',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xs',
  ghost: 'text-slate-600 hover:bg-slate-100',
};

const sizes = {
  md: 'h-9 px-4 text-sm',
  sm: 'h-8 px-3 text-sm',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {loading ? (
      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
    ) : (
      Icon && <Icon className="w-4 h-4" aria-hidden="true" />
    )}
    {children}
  </button>
);

export default Button;

