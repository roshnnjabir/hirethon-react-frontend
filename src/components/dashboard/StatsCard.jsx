import React from 'react';
import { formatNumber } from '../../utils/helpers';

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon: Icon,
  loading = false,
  className = '',
}) => {
  const changeColors = {
    positive: 'text-brand-gold',
    negative: 'text-brand-crimson',
    neutral: 'text-neutral-500',
  };

  const changeBgColors = {
    positive: 'bg-brand-gold/10',
    negative: 'bg-brand-crimson/10',
    neutral: 'bg-neutral-100',
  };

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-neutral-200 rounded-lg"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {Icon && (
            <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center mr-3">
              <Icon className="w-5 h-5 text-brand-orange" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <p className="text-2xl font-bold text-neutral-900">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
          </div>
        </div>
        
        {change !== undefined && change !== null && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${changeBgColors[changeType]} ${changeColors[changeType]}`}>
            {change > 0 ? '+' : ''}{change}%
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
