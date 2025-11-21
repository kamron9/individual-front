import React from 'react';

function StatCard({
  title,
  value,
  icon: Icon,
  color = 'primary',
  loading = false,
}) {
  const colorClasses = {
    primary:
      'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400',
    green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
    purple:
      'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
    orange:
      'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400',
  };

  const formatValue = val => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toLocaleString('uz-UZ');
    }
    return val;
  };

  return (
    <div className="card fade-in">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          {loading ? (
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatValue(value)}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
