import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Search,
  TrendingUp,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { getTopFoods, subscribeToEvents } from '../services/api';
import { mockFoods } from '../utils/mockData';

function Foods() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [foods, setFoods] = useState([]);
  const [useMockData, setUseMockData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('quantity'); // quantity or revenue
  const [sortOrder, setSortOrder] = useState('desc'); // asc or desc

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTopFoods(1000); // Get all foods

      if (data && data.length > 0) {
        setFoods(data);
        setUseMockData(false);
      } else {
        // If no data, use mock data
        setFoods(mockFoods);
        setUseMockData(true);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
      // On error, use mock data
      setFoods(mockFoods);
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time updates - more frequent to see quantity changes
    const unsubscribe = subscribeToEvents(data => {
      // Refetch data when new stats arrive (every 3-5 seconds)
      if (data.stats) {
        fetchData();
      }
    });

    // Also refetch data periodically to ensure updates
    const refetchInterval = setInterval(() => {
      fetchData();
    }, 4000); // Every 4 seconds

    return () => {
      unsubscribe();
      clearInterval(refetchInterval);
    };

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Filtered and sorted foods
  const filteredAndSortedFoods = useMemo(() => {
    let result = [...foods];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        food =>
          food.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          food.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      let aValue = a[sortField] || 0;
      let bValue = b[sortField] || 0;

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    return result;
  }, [foods, searchTerm, sortField, sortOrder]);

  const handleSort = field => {
    if (sortField === field) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatCurrency = value => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getSortIcon = field => {
    if (sortField !== field) {
      return <ArrowUpDown size={16} className="text-gray-400" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={16} className="text-primary-600" />
    ) : (
      <ArrowDown size={16} className="text-primary-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('foods')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time taomlar ro'yxati va statistika
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {useMockData ? (
            <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertCircle
                size={16}
                className="text-yellow-600 dark:text-yellow-400"
              />
              <span className="text-xs text-yellow-700 dark:text-yellow-300">
                Mock Data
              </span>
            </div>
          ) : (
            <span className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('realTime')}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t('search')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Sort by Quantity */}
          <button
            onClick={() => handleSort('quantity')}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              sortField === 'quantity'
                ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {getSortIcon('quantity')}
            <span className="text-sm font-medium">{t('sortByQuantity')}</span>
          </button>

          {/* Sort by Revenue */}
          <button
            onClick={() => handleSort('revenue')}
            className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              sortField === 'revenue'
                ? 'bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-700 dark:text-primary-300'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            {getSortIcon('revenue')}
            <span className="text-sm font-medium">{t('sortByRevenue')}</span>
          </button>
        </div>
      </div>

      {/* Foods Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading-spinner" />
          </div>
        ) : filteredAndSortedFoods.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('noData')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('ranking')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('foodName')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('category')}
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{t('quantity')}</span>
                      {getSortIcon('quantity')}
                    </div>
                  </th>
                  <th
                    className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{t('revenue')}</span>
                      {getSortIcon('revenue')}
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('averagePrice')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedFoods.map((food, index) => {
                  // Calculate average price
                  const avgPrice =
                    food.revenue > 0 && food.quantity > 0
                      ? food.revenue / food.quantity
                      : 0;

                  return (
                    <tr
                      key={`${food.food_name}-${index}`}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">
                        <div className="flex items-center space-x-2">
                          {index < 3 && (
                            <TrendingUp className="text-yellow-500" size={16} />
                          )}
                          <span className="font-medium text-gray-900 dark:text-white">
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        {food.food_name}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                          {food.category || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        {food.quantity?.toLocaleString('uz-UZ') || 0}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(food.revenue || 0)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(avgPrice)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {!loading && filteredAndSortedFoods.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {t('soldItems')}: {filteredAndSortedFoods.length}
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {t('totalSold')}:{' '}
                {filteredAndSortedFoods
                  .reduce((sum, food) => sum + (food.quantity || 0), 0)
                  .toLocaleString('uz-UZ')}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Foods;
