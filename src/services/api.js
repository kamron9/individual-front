import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getOverviewStats = async () => {
  const response = await api.get('/api/stats/overview');
  return response.data;
};

export const getTopFoods = async (limit = 10) => {
  const response = await api.get(`/api/stats/top-foods?limit=${limit}`);
  return response.data;
};

export const getCategoryAnalysis = async () => {
  const response = await api.get('/api/stats/category-analysis');
  return response.data;
};

export const getTimeTrend = async (period = 'daily') => {
  const response = await api.get(`/api/stats/time-trend?period=${period}`);
  return response.data;
};

export const getHeatmap = async () => {
  const response = await api.get('/api/stats/heatmap');
  return response.data;
};

export const getCustomerAnalysis = async () => {
  const response = await api.get('/api/stats/customer-analysis');
  return response.data;
};

export const getOrders = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const response = await api.get(`/api/orders?${params.toString()}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/api/categories');
  return response.data;
};

export const exportToExcel = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const response = await api.get(`/api/export/excel?${params.toString()}`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'orders.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const subscribeToEvents = callback => {
  let eventSource;

  const connect = () => {
    try {
      eventSource = new EventSource(`${API_BASE_URL}/api/events/stream`);

      eventSource.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = error => {
        console.error('SSE error:', error);
        if (eventSource) {
          eventSource.close();
        }
        // Reconnect after 5 seconds
        setTimeout(connect, 5000);
      };
    } catch (error) {
      console.error('Error creating EventSource:', error);
      setTimeout(connect, 5000);
    }
  };

  connect();

  return () => {
    if (eventSource) {
      eventSource.close();
    }
  };
};

export default api;
