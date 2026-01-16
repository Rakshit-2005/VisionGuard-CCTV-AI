import React from 'react';
import { HardHat, Glasses, Hand, CircleDot, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PPEType = 'helmet' | 'shoes' | 'goggles' | 'mask' | 'gloves';

interface PPEIconProps {
  type: PPEType;
  status?: 'compliant' | 'missing';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap: Record<PPEType, React.ComponentType<{ className?: string }>> = {
  helmet: HardHat,
  shoes: Footprints,
  goggles: Glasses,
  mask: CircleDot,
  gloves: Hand,
};

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export function PPEIcon({ type, status = 'compliant', size = 'md', className }: PPEIconProps) {
  const Icon = iconMap[type];
  
  return (
    <div
      className={cn(
        'ppe-icon',
        status === 'compliant' ? 'ppe-compliant' : 'ppe-missing',
        className
      )}
      title={`${type} - ${status}`}
    >
      <Icon className={sizeMap[size]} />
    </div>
  );
}

interface PPEStatusGroupProps {
  missing?: PPEType[];
  all?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const allPPE: PPEType[] = ['helmet', 'shoes', 'goggles', 'mask', 'gloves'];

export function PPEStatusGroup({ missing = [], all = false, size = 'md' }: PPEStatusGroupProps) {
  const items = all ? allPPE : missing;
  
  if (all) {
    return (
      <div className="flex gap-1.5">
        {allPPE.map(type => (
          <PPEIcon
            key={type}
            type={type}
            status={missing.includes(type) ? 'missing' : 'compliant'}
            size={size}
          />
        ))}
      </div>
    );
  }
  
  return (
    <div className="flex gap-1.5">
      {items.map(type => (
        <PPEIcon key={type} type={type} status="missing" size={size} />
      ))}
    </div>
  );
}

export function PPELabel({ type }: { type: PPEType }) {
  const labels: Record<PPEType, string> = {
    helmet: 'Helmet',
    shoes: 'Safety Shoes',
    goggles: 'Safety Goggles',
    mask: 'Face Mask',
    gloves: 'Gloves',
  };
  
  return <span className="capitalize">{labels[type]}</span>;
}
