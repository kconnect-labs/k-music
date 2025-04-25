// Цветовая схема K-Music
export const COLORS = {
  // Основные цвета
  PRIMARY: '#D0BCFF',
  PRIMARY_LIGHT: '#E9DDFF',
  PRIMARY_DARK: '#9A7ACE',
  
  // Фоны
  BACKGROUND: '#131313',
  BACKGROUND_SECONDARY: '#1C1C1C',
  SURFACE: '#1D1D1D',
  
  // Текст
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#C2C2C2',
  
  // Статусы
  ERROR: '#F28C9A',
  SUCCESS: '#6CD67D',
  
  // Дополнительные цвета для интерфейса
  INPUT_BACKGROUND: '#2C2848',
  CARD_BACKGROUND: '#1E1B33',
  BORDER: '#3D3A50',
  DISABLED: '#666666',
  LOADING_BACKGROUND: 'rgba(0, 0, 0, 0.7)',
};

// Стили текста
export const FONTS = {
  // Веса шрифтов
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  SEMI_BOLD: '600',
  BOLD: '700',
  
  // Размеры
  TINY: 10,
  SMALL: 12,
  MEDIUM: 14,
  REGULAR: 16,
  LARGE: 18,
  X_LARGE: 20,
  XX_LARGE: 24,
  XXX_LARGE: 28,
  TITLE: 32,
};

// Стили текста для React Navigation
export const TEXT_VARIANTS = {
  // Стиль для обычного текста
  body: {
    fontFamily: undefined,
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 22,
  },
  // Стиль для заголовков
  headline: {
    fontFamily: undefined,
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 32,
  },
  // Стиль для подзаголовков
  subheading: {
    fontFamily: undefined,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },
  // Стиль для мелкого текста
  caption: {
    fontFamily: undefined,
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 16,
  },
  // Стиль для кнопок
  button: {
    fontFamily: undefined,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22,
  },
  // Стили для табов и навигации
  medium: {
    fontFamily: undefined,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22,
  },
};

// Размеры экрана
export const SIZES = {
  BASE: 8,
  SMALL: 12,
  MEDIUM: 16,
  LARGE: 24,
  X_LARGE: 32,
  XX_LARGE: 40,
  XXX_LARGE: 48,
  
  // Стандартные отступы
  PADDING: 16,
  MARGIN: 16,
  RADIUS: 8,
};

// Тени
export const SHADOWS = {
  SMALL: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 8,
  },
};

export default { COLORS, FONTS, SIZES, SHADOWS, TEXT_VARIANTS }; 