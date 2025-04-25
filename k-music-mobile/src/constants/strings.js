// Строки для русской локализации приложения K-Music

export const AUTH_STRINGS = {
  // Общие
  WELCOME_BACK: 'Добро пожаловать',
  LOGIN_SUBTITLE: 'Войдите в свой аккаунт',
  
  // Авторизация
  LOGIN: 'Войти',
  LOGIN_FAILED: 'Ошибка входа',
  LOGIN_FAILED_MESSAGE: 'Не удалось войти. Проверьте логин и пароль.',
  
  // Регистрация
  CREATE_ACCOUNT: 'Создать аккаунт',
  SIGNUP_SUBTITLE: 'Зарегистрируйтесь, чтобы начать',
  REGISTER: 'Зарегистрироваться',
  REGISTRATION_SUCCESSFUL: 'Регистрация прошла успешно',
  REGISTRATION_SUCCESSFUL_MESSAGE: 'Ваш аккаунт создан. Пожалуйста, проверьте электронную почту для подтверждения аккаунта перед входом.',
  REGISTRATION_FAILED: 'Ошибка регистрации',
  REGISTRATION_FAILED_MESSAGE: 'Не удалось зарегистрироваться. Попробуйте еще раз.',
  
  // Настройка профиля
  COMPLETE_PROFILE: 'Заполните профиль',
  PROFILE_SUBTITLE: 'Расскажите о себе',
  COMPLETE_SETUP: 'Завершить настройку',
  PROFILE_SETUP_SUCCESSFUL: 'Профиль настроен',
  PROFILE_SETUP_SUCCESSFUL_MESSAGE: 'Ваш профиль успешно настроен!',
  PROFILE_SETUP_FAILED: 'Ошибка настройки профиля',
  PROFILE_SETUP_FAILED_MESSAGE: 'Не удалось настроить профиль. Попробуйте еще раз.',
  
  // Поля форм
  USERNAME_OR_EMAIL: 'Имя пользователя или Email',
  USERNAME: 'Имя пользователя',
  EMAIL: 'Email',
  PASSWORD: 'Пароль',
  CONFIRM_PASSWORD: 'Подтвердите пароль',
  DISPLAY_NAME: 'Отображаемое имя',
  INTERESTS: 'Интересы (необязательно)',
  ABOUT_ME: 'О себе (необязательно)',
  
  // Плейсхолдеры
  ENTER_USERNAME_OR_EMAIL: 'Введите имя пользователя или email',
  CHOOSE_USERNAME: 'Выберите имя пользователя',
  ENTER_EMAIL: 'Введите ваш email',
  ENTER_PASSWORD: 'Введите пароль',
  CREATE_PASSWORD: 'Создайте пароль',
  CONFIRM_YOUR_PASSWORD: 'Подтвердите ваш пароль',
  ENTER_NAME: 'Введите ваше имя',
  ENTER_INTERESTS: 'Музыка, искусство, игры и т.д.',
  ENTER_ABOUT: 'Расскажите о себе',
  
  // Ошибки валидации
  USERNAME_REQUIRED: 'Имя пользователя обязательно',
  USERNAME_TOO_SHORT: 'Имя пользователя должно содержать минимум 3 символа',
  EMAIL_REQUIRED: 'Email обязателен',
  INVALID_EMAIL: 'Некорректный формат email',
  PASSWORD_REQUIRED: 'Пароль обязателен',
  PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 6 символов',
  PASSWORDS_DO_NOT_MATCH: 'Пароли не совпадают',
  NAME_REQUIRED: 'Имя обязательно',
  
  // Ссылки
  DONT_HAVE_ACCOUNT: 'Нет аккаунта?',
  ALREADY_HAVE_ACCOUNT: 'Уже есть аккаунт?',
  
  // Прочее
  ADD_PHOTO: 'Добавить фото',
  PERMISSION_DENIED: 'Доступ запрещен',
  PERMISSION_DENIED_MESSAGE: 'Для доступа к галерее необходимо разрешение',
  PICKUP_IMAGE_ERROR: 'Ошибка при выборе изображения',
};

export const APP_STRINGS = {
  // Главный экран
  WELCOME: 'Добро пожаловать в К-Музыка!',
  HELLO: 'Привет',
  COMING_SOON: 'Добро пожаловать в мир музыки...',
  LOGOUT: 'Выйти',
  
  // Общие
  OK: 'OK',
  CANCEL: 'Отмена',
  SAVE: 'Сохранить',
  DELETE: 'Удалить',
  EDIT: 'Изменить',
  LOADING: 'Загрузка...',
  ERROR: 'Ошибка',
  SUCCESS: 'Успешно',
  
  // Музыкальные разделы
  MUSIC: 'Музыка',
  POPULAR: 'Популярное',
  FAVORITES: 'Избранное',
  NEW_RELEASES: 'Новинки',
  NEW: 'Новинки',
  RANDOM: 'Случайное',
  SEARCH: 'Поиск',
  ALL_TRACKS: 'Все треки',
  NO_RESULTS: 'Ничего не найдено',
  SEARCHING: 'Поиск...',
  NO_TRACKS: 'Нет доступных треков',
  SEARCH_RESULTS: 'Результаты поиска',
  
  // Музыкальный плеер
  NOW_PLAYING: 'Сейчас играет',
  PLAY: 'Воспроизвести',
  PAUSE: 'Пауза',
  NEXT: 'Следующий',
  PREVIOUS: 'Предыдущий',
  ADD_TO_FAVORITES: 'Добавить в избранное',
  REMOVE_FROM_FAVORITES: 'Удалить из избранного',
  VOLUME: 'Громкость',
  SHUFFLE: 'Перемешать',
  REPEAT: 'Повторять',
  NO_TRACK_SELECTED: 'Трек не выбран',
  
  // Треки
  TRACK: 'Трек',
  TRACKS: 'Треки',
  ARTIST: 'Исполнитель',
  ALBUM: 'Альбом',
  DURATION: 'Длительность',
  SEARCH_PLACEHOLDER: 'Поиск музыки...',
  NO_TRACKS_FOUND: 'Треки не найдены',
  LOAD_MORE: 'Загрузить еще',
  
  // Сообщения
  TRACK_ADDED_TO_FAVORITES: 'Трек добавлен в избранное',
  TRACK_REMOVED_FROM_FAVORITES: 'Трек удален из избранного',
  SEARCH_TRACKS: 'Поиск треков',
  LOADING_TRACKS: 'Загрузка треков...',
};

export default {
  ...AUTH_STRINGS,
  ...APP_STRINGS
}; 