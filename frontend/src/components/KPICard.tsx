import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive?: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: KPICardProps) {
  const variantStyles = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  const bgStyles = {
    default: 'from-primary/10 to-transparent',
    success: 'from-success/10 to-transparent',
    warning: 'from-warning/10 to-transparent',
    danger: 'from-danger/10 to-transparent',
  };

  return (
    <div className={cn('kpi-card group animate-fade-in', className)}>
      {/* Background gradient overlay */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity',
          bgStyles[variant]
        )}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className={cn(
              'p-3 rounded-xl bg-gradient-to-br',
              variant === 'default' && 'from-primary/20 to-primary/5',
              variant === 'success' && 'from-success/20 to-success/5',
              variant === 'warning' && 'from-warning/20 to-warning/5',
              variant === 'danger' && 'from-danger/20 to-danger/5'
            )}
          >
            <Icon className={cn('w-6 h-6', variantStyles[variant])} />
          </div>
          
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
                trend.isPositive 
                  ? 'text-success bg-success/10' 
                  : 'text-danger bg-danger/10'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : trend.value === 0 ? (
                <Minus className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn('text-3xl font-bold tracking-tight', variantStyles[variant])}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
