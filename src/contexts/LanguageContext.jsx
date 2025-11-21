import React, { createContext, useContext, useState } from 'react';

const translations = {
  uz: {
    appTitle: 'Restoran Buyurtma Tahlili',
    dashboard: 'Dashboard',
    analysis: 'Tahlil',
    totalOrders: 'Jami buyurtmalar',
    totalRevenue: 'Jami daromad',
    averageCheck: "O'rtacha check",
    totalCustomers: 'Jami mijozlar',
    mostPopularFood: 'Eng mashhur ovqat',
    topFoods: 'TOP Ovqatlar',
    categoryAnalysis: "Kategoriya bo'yicha tahlil",
    timeTrend: "Vaqt bo'yicha trend",
    customerAnalysis: 'Mijoz tahlili',
    heatmap: 'Faollik xaritasi',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    noData: "Ma'lumot mavjud emas",
    export: 'Eksport qilish',
    filter: 'Filtr',
    apply: "Qo'llash",
    reset: 'Qayta tiklash',
    startDate: 'Boshlanish sanasi',
    endDate: 'Tugash sanasi',
    category: 'Kategoriya',
    minPrice: 'Minimal narx',
    maxPrice: 'Maksimal narx',
    period: 'Davr',
    daily: 'Kunlik',
    weekly: 'Haftalik',
    monthly: 'Oylik',
    yearly: 'Yillik',
    revenue: 'Daromad',
    orders: 'Buyurtmalar',
    quantity: 'Miqdor',
    topCustomers: 'Eng faol mijozlar',
    repeatRate: 'Qaytib kelish foizi',
    avgOrderValue: "O'rtacha buyurtma qiymati",
    realTime: 'Real-time',
    language: 'Til',
    foods: 'Taomlar',
    foodName: 'Ovqat nomi',
    totalSold: 'Jami sotilgan',
    sortBy: 'Saralash',
    sortByQuantity: "Miqdor bo'yicha",
    sortByRevenue: "Daromad bo'yicha",
    ascending: "O'sish",
    descending: 'Kamayish',
    averagePrice: "O'rtacha narx",
    category: 'Kategoriya',
    ranking: "O'rin",
    soldItems: 'Sotilgan mahsulotlar',
    search: 'Qidirish...',
  },
  ru: {
    appTitle: 'Анализ заказов ресторана',
    dashboard: 'Панель',
    analysis: 'Анализ',
    totalOrders: 'Всего заказов',
    totalRevenue: 'Общий доход',
    averageCheck: 'Средний чек',
    totalCustomers: 'Всего клиентов',
    mostPopularFood: 'Самое популярное блюдо',
    topFoods: 'ТОП Блюда',
    categoryAnalysis: 'Анализ по категориям',
    timeTrend: 'Тренд по времени',
    customerAnalysis: 'Анализ клиентов',
    heatmap: 'Карта активности',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    noData: 'Нет данных',
    export: 'Экспорт',
    filter: 'Фильтр',
    apply: 'Применить',
    reset: 'Сбросить',
    startDate: 'Дата начала',
    endDate: 'Дата окончания',
    category: 'Категория',
    minPrice: 'Минимальная цена',
    maxPrice: 'Максимальная цена',
    period: 'Период',
    daily: 'Дневной',
    weekly: 'Недельный',
    monthly: 'Месячный',
    yearly: 'Годовой',
    revenue: 'Доход',
    orders: 'Заказы',
    quantity: 'Количество',
    topCustomers: 'Самые активные клиенты',
    repeatRate: 'Процент возврата',
    avgOrderValue: 'Средняя стоимость заказа',
    realTime: 'В реальном времени',
    language: 'Язык',
    foods: 'Блюда',
    foodName: 'Название блюда',
    totalSold: 'Всего продано',
    sortBy: 'Сортировка',
    sortByQuantity: 'По количеству',
    sortByRevenue: 'По доходу',
    ascending: 'По возрастанию',
    descending: 'По убыванию',
    averagePrice: 'Средняя цена',
    category: 'Категория',
    ranking: 'Рейтинг',
    soldItems: 'Проданные товары',
    search: 'Поиск...',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'uz'
  );

  const changeLanguage = lang => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = key => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
