import { Download, Filter, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { exportToExcel, getCategories, getOrders } from '../services/api';

// Mock categories
const mockCategories = [
  'Asosiy ovqat',
  'Grill',
  'Fast food',
  'Suyuq ovqat',
  'Salat',
  'Desert',
  'Ichimlik',
];

// Mock orders
const generateMockOrders = () => {
  const foods = [
    'osh',
    "lag'mon",
    'shashlik',
    'manti',
    'somsa',
    'chuchvara',
    'salyanka',
    'borshch',
    'pizza',
    'gamburger',
    'lavash',
    'donar',
  ];
  const categories = ['Asosiy ovqat', 'Grill', 'Fast food', 'Suyuq ovqat'];
  const orders = [];

  for (let i = 1; i <= 50; i++) {
    const food = foods[Math.floor(Math.random() * foods.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = Math.floor(Math.random() * 50000) + 10000;
    const quantity = Math.floor(Math.random() * 3) + 1;
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    orders.push({
      order_id: i,
      customer_id: Math.floor(Math.random() * 100) + 1,
      food_name: food,
      category: category,
      price: price,
      quantity: quantity,
      date: date.toISOString().split('T')[0],
      time: `${Math.floor(Math.random() * 12) + 8}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, '0')}`,
    });
  }

  return orders;
};

const mockOrders = generateMockOrders();

function Analysis() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    category: '',
    min_price: '',
    max_price: '',
  });

  useEffect(() => {
    fetchCategories();
    fetchOrders();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data && data.length > 0 ? data : mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories(mockCategories);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(filters);
      setOrders(data && data.length > 0 ? data : mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchOrders();
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: '',
      end_date: '',
      category: '',
      min_price: '',
      max_price: '',
    });
    setTimeout(fetchOrders, 100);
  };

  const handleExport = async () => {
    try {
      await exportToExcel(filters);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Export qilishda xatolik yuz berdi');
    }
  };

  const formatCurrency = value => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('analysis')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Buyurtmalarni filtrlash va tahlil qilish
          </p>
        </div>
        <button
          onClick={handleExport}
          className="btn-primary flex items-center space-x-2"
        >
          <Download size={20} />
          <span>{t('export')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} />
          <h2 className="text-lg font-semibold dark:text-white">
            {t('filter')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('startDate')}
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={e => handleFilterChange('start_date', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('endDate')}
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={e => handleFilterChange('end_date', e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('category')}
            </label>
            <select
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">Barcha</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('minPrice')}
            </label>
            <input
              type="number"
              value={filters.min_price}
              onChange={e => handleFilterChange('min_price', e.target.value)}
              placeholder="Minimal narx"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('maxPrice')}
            </label>
            <input
              type="number"
              value={filters.max_price}
              onChange={e => handleFilterChange('max_price', e.target.value)}
              placeholder="Maksimal narx"
              className="input-field"
            />
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <button onClick={handleApplyFilters} className="btn-primary">
            {t('apply')}
          </button>
          <button
            onClick={handleResetFilters}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>{t('reset')}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold dark:text-white">
            Natijalar ({orders.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="loading-spinner" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t('noData')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Buyurtma ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Mijoz ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ovqat nomi
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Kategoriya
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Narx
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Miqdor
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Jami
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Sana
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Vaqt
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-sm">{order.order_id}</td>
                    <td className="py-3 px-4 text-sm">{order.customer_id}</td>
                    <td className="py-3 px-4 text-sm">{order.food_name}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded text-xs">
                        {order.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {formatCurrency(order.price)}
                    </td>
                    <td className="py-3 px-4 text-sm">{order.quantity}</td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {formatCurrency(order.price * order.quantity)}
                    </td>
                    <td className="py-3 px-4 text-sm">{order.date}</td>
                    <td className="py-3 px-4 text-sm">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analysis;
