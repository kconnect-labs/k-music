import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AuthService = {
  /**
   * @param {string} usernameOrEmail - Email - пока толлько почта
   * @param {string} password - Пароль
   * @returns {Promise} - Promise с данными пользователя или ошибкой
   */
  login: async (usernameOrEmail, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        usernameOrEmail,
        password
      });
      
      if (response.data.success) {
        // Если вход выполнен успешно, сохраняем данные пользователя
        if (response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          await AsyncStorage.setItem('needsProfileSetup', 'false');
          
          // Сохраняем токен, если он предоставлен
          if (response.data.token) {
            await AsyncStorage.setItem('authToken', response.data.token);
          }
        }
        
        if (response.data.needsProfileSetup) {
          await AsyncStorage.setItem('needsProfileSetup', 'true');
          
          if (response.data.chat_id) {
            await AsyncStorage.setItem('chatId', response.data.chat_id);
          }
        } else {
          await AsyncStorage.removeItem('needsProfileSetup');
        }
        
        return response.data;
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  /**
   * Регистрация нового пользователя
   * @param {string} username - Имя пользователя
   * @param {string} email - Email
   * @param {string} password - Пароль
   * @returns {Promise} - Promise с результатом регистрации
   */
  register: async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  /**
   * @param {Object} profileData - User profile data
   * @returns {Promise} - Promise with setup result
   */
  setupProfile: async (profileData) => {
    try {
      const chatId = await AsyncStorage.getItem('chatId');
      if (chatId) {
        profileData.chat_id = chatId;
      }
      
      const formData = new FormData();
      
      Object.keys(profileData).forEach(key => {
        if (key === 'photo' && profileData.photo && profileData.photo.uri) {
          const photoUri = profileData.photo.uri;
          const filename = photoUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image';
          
          formData.append('photo', {
            uri: photoUri,
            name: filename,
            type
          });
        } else {
          formData.append(key, profileData[key]);
        }
      });
      
      const response = await api.post('/api/auth/register-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success && response.data.user) {
        // Store user data
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('needsProfileSetup', 'false');
        await AsyncStorage.removeItem('chatId');
      }
      
      return response.data;
    } catch (error) {
      console.error('Profile setup error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  /**

   * @returns {Promise} -
   */
  checkAuth: async () => {
    try {
      const response = await api.get('/api/auth/check');
      
      if (response.data.isAuthenticated && response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('needsProfileSetup', 'false');
      } else if (response.data.needsProfileSetup) {
        await AsyncStorage.setItem('needsProfileSetup', 'true');
      } else {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('needsProfileSetup');
      }
      
      return response.data;
    } catch (error) {
      console.error('Auth check error:', error.response?.data || error.message);
      return {
        isAuthenticated: false,
        error: error.response?.data?.error || 'Ошибка проверки аутентификации'
      };
    }
  },
  
  /**
   *  
   * @returns {Promise} - 
   */
  logout: async () => {
    try {
      await api.post('/api/auth/logout');
      
      // Очищаем хранилище данных независимо от ответа API
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('needsProfileSetup');
      await AsyncStorage.removeItem('chatId');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
      
        // Still clear data even if API call fails
        await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('needsProfileSetup');
      await AsyncStorage.removeItem('chatId');
      
      throw error;
    }
  },
  
  /**
   * Получить данные пользователя из хранилища
   * @returns {Promise} - Promise с данными пользователя или null
   */
  getCurrentUser: async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      if (userString) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      console.error('Ошибка при получении пользователя из хранилища:', error);
      return null;
    }
  },
  
  /**
   * @returns {Promise<boolean>} - Нужно ли настроить профиль
   */
  needsProfileSetup: async () => {
    try {
      const needsSetup = await AsyncStorage.getItem('needsProfileSetup');
      return needsSetup === 'true';
    } catch (error) {
      console.error('Ошибка при проверке настройки профиля:', error);
      return false;
    }
  }
};

export default AuthService; 