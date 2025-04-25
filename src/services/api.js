import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: 'https://k-connect.ru',
  timeout: 30000, // Увеличиваем timeout до 30 секунд
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов для добавления токена аутентификации
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Ошибка при получении токена из хранилища:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Улучшенная обработка ошибок
    if (error.code === 'ECONNABORTED') {
      console.error('Таймаут запроса:', error.message);
      // Можно добавить повторную попытку соединения
      return Promise.reject(new Error('Превышено время ожидания. Проверьте подключение к интернету.'));
    }

    const originalRequest = error.config;
    
    // Если ошибка 401 (неавторизован) и запрос еще не повторялся
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Можно добавить логику обновления токена
        // const refreshToken = await AsyncStorage.getItem('refreshToken');
        // const response = await api.post('/api/auth/refresh', { refreshToken });
        // await AsyncStorage.setItem('authToken', response.data.token);
        
        // return api(originalRequest);
        
        // Пока просто выходим из системы при истечении токена
        await AsyncStorage.removeItem('authToken');
        return Promise.reject(error);
      } catch (refreshError) {
        // При ошибке обновления токена выходим из системы
        await AsyncStorage.removeItem('authToken');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 