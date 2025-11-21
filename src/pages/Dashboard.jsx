import React, { useState, useEffect } from 'react'
import { ShoppingCart, DollarSign, Users, TrendingUp, Activity } from 'lucide-react'
import StatCard from '../components/StatCard'
import { LineChart, BarChart, DoughnutChart } from '../components/Chart'
import Heatmap from '../components/Heatmap'
import { useLanguage } from '../contexts/LanguageContext'
import {
  getOverviewStats,
  getTopFoods,
  getCategoryAnalysis,
  getTimeTrend,
  getHeatmap,
  getCustomerAnalysis,
  subscribeToEvents,
} from '../services/api';
import { mockOverviewStats, mockCategoryAnalysis, mockFoods } from '../utils/mockData';

function Dashboard() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState({})
  const [topFoods, setTopFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [timeTrend, setTimeTrend] = useState([])
  const [heatmap, setHeatmap] = useState(null)
  const [customerStats, setCustomerStats] = useState({})
  const [period, setPeriod] = useState('daily')

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        overviewData,
        topFoodsData,
        categoriesData,
        timeTrendData,
        heatmapData,
        customerData,
      ] = await Promise.all([
        getOverviewStats().catch(() => mockOverviewStats),
        getTopFoods(10).catch(() => mockFoods.slice(0, 10)),
        getCategoryAnalysis().catch(() => mockCategoryAnalysis),
        getTimeTrend(period).catch(() => []),
        getHeatmap().catch(() => null),
        getCustomerAnalysis().catch(() => ({
          top_customers: [],
          avg_order_value: 0,
          repeat_rate: 0,
        })),
      ]);

      setOverview(overviewData || mockOverviewStats);
      setTopFoods(topFoodsData || mockFoods.slice(0, 10));
      setCategories(categoriesData || mockCategoryAnalysis);
      setTimeTrend(timeTrendData || []);
      setHeatmap(heatmapData);
      setCustomerStats(customerData || {
        top_customers: [],
        avg_order_value: 0,
        repeat_rate: 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data
      setOverview(mockOverviewStats);
      setTopFoods(mockFoods.slice(0, 10));
      setCategories(mockCategoryAnalysis);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData()

    // Real-time updates
    const unsubscribe = subscribeToEvents((data) => {
      if (data.stats) {
        setOverview(data.stats)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const data = await getTimeTrend(period)
        setTimeTrend(data)
      } catch (error) {
        console.error('Error fetching trend:', error)
      }
    }
    fetchTrend()
  }, [period])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('dashboard')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('realTime')} statistika va tahlil
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('realTime')}
            </span>
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('totalOrders')}
          value={overview.total_orders || 0}
          icon={ShoppingCart}
          color="primary"
          loading={loading}
        />
        <StatCard
          title={t('totalRevenue')}
          value={formatCurrency(overview.total_revenue || 0)}
          icon={DollarSign}
          color="green"
          loading={loading}
        />
        <StatCard
          title={t('averageCheck')}
          value={formatCurrency(overview.average_check || 0)}
          icon={TrendingUp}
          color="blue"
          loading={loading}
        />
        <StatCard
          title={t('totalCustomers')}
          value={overview.total_customers || 0}
          icon={Users}
          color="purple"
          loading={loading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DoughnutChart
          data={categories}
          title={t('categoryAnalysis')}
          labelKey="category"
          valueKey="revenue"
          loading={loading}
        />
        <BarChart
          data={topFoods}
          title={t('topFoods')}
          labelKey="food_name"
          valueKey="quantity"
          loading={loading}
        />
      </div>

      {/* Time Trend */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t('timeTrend')}
        </h2>
        <div className="flex space-x-2">
          {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {t(p)}
            </button>
          ))}
        </div>
      </div>
      <LineChart
        data={timeTrend}
        title={t('timeTrend')}
        loading={loading}
      />

      {/* Heatmap */}
      {/* <Heatmap data={heatmap} loading={loading} /> */}

      {/* Customer Analysis */}
      {/* {customerStats.top_customers && customerStats.top_customers.length > 0 && (
        <div className="card fade-in">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">
            {t('customerAnalysis')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('avgOrderValue')}
              </p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {formatCurrency(customerStats.avg_order_value || 0)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('repeatRate')}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(customerStats.repeat_rate || 0).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    Mijoz ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('orders')}
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('revenue')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {customerStats.top_customers.slice(0, 5).map((customer) => (
                  <tr
                    key={customer.customer_id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-sm">{customer.customer_id}</td>
                    <td className="py-3 px-4 text-sm">{customer.orders}</td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {formatCurrency(customer.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}
    </div>
  )
}

export default Dashboard

