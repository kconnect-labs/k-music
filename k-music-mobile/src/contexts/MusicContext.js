import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import api from '../services/api';

// Создаем контекст для музыки
export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  // Стейты для музыкального плеера
  const [tracks, setTracks] = useState([]); // Все треки
  const [popularTracks, setPopularTracks] = useState([]); // Популярные треки
  const [likedTracks, setLikedTracks] = useState([]); // Понравившиеся треки
  const [newTracks, setNewTracks] = useState([]); // Новые треки
  const [randomTracks, setRandomTracks] = useState([]); // Случайные треки
  const [currentTrack, setCurrentTrack] = useState(null); // Текущий трек
  const [isPlaying, setIsPlaying] = useState(false); // Статус воспроизведения
  const [duration, setDuration] = useState(0); // Длительность трека
  const [position, setPosition] = useState(0); // Текущая позиция
  const [isLoading, setIsLoading] = useState(true); // Статус загрузки
  const [volume, setVolume] = useState(1.0); // Громкость (0-1)
  const [currentSection, setCurrentSection] = useState('all'); // Текущий раздел
  const [searchResults, setSearchResults] = useState([]); // Результаты поиска
  const [isSearching, setIsSearching] = useState(false); // Статус поиска
  
  // Пагинация
  const [hasMoreTracks, setHasMoreTracks] = useState(true);
  const [page, setPage] = useState(1);
  const [pageByType, setPageByType] = useState({
    all: 1,
    popular: 1,
    liked: 1,
    new: 1,
    random: 1
  });
  
  // Ссылка на аудио плеер
  const soundRef = useRef(null);
  
  // Таймер для обновления позиции
  const positionTimer = useRef(null);
  
  // Инициализация аудио и запрос разрешений
  useEffect(() => {
    async function setupAudio() {
      try {
        // Запрашиваем разрешения на аудио
        await Audio.requestPermissionsAsync();
        // Устанавливаем режим аудио
        await initializeAudio();
        
        // Восстанавливаем последний трек из хранилища
        restoreLastTrack();
        
        console.log('Аудио инициализировано');
      } catch (error) {
        console.error('Ошибка при инициализации аудио:', error);
      }
    }
    
    // Загружаем треки
    fetchAllTrackSections();
    setupAudio();
    
    // Очистка при размонтировании
    return () => {
      if (positionTimer.current) {
        clearInterval(positionTimer.current);
      }
      
      // Освобождаем ресурсы плеера
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);
  
  const initializeAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS || 1,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS || 1,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error("Error setting audio mode:", error);
      // Fallback to basic settings if we get an error
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
      } catch (fallbackError) {
        console.error('Критическая ошибка при инициализации аудио:', fallbackError);
      }
    }
  };
  
  // Загружаем все секции треков при старте
  const fetchAllTrackSections = async () => {
    try {
      // Сначала загружаем основной список
      fetchTracks('all');
      
      // Затем подгружаем популярные, лайкнутые, новые и случайные треки
      setTimeout(() => fetchTracks('popular'), 300);
      setTimeout(() => fetchTracks('liked'), 600);
      setTimeout(() => fetchTracks('new'), 900);
      setTimeout(() => fetchTracks('random'), 1200);
    } catch (error) {
      console.error('Ошибка при загрузке всех секций:', error);
    }
  };
  
  // Загрузка треков с сервера
  const fetchTracks = async (section = 'all') => {
    if (isLoading && section === currentSection) return;
    
    setIsLoading(true);
    setCurrentSection(section);
    
    try {
      let endpoint = '/api/music';
      let params = { page: 1, per_page: 20 };
      
      // Выбираем эндпоинт в зависимости от раздела
      if (section === 'liked') {
        endpoint = '/api/music/liked';
      } else if (section === 'popular') {
        params.sort = 'popular';
      } else if (section === 'new') {
        params.sort = 'date';
      } else if (section === 'random') {
        endpoint = '/api/music/random';
      }
      
      const response = await api.get(endpoint, { params });
      
      const receivedTracks = response.data.tracks || [];
      
      // Обновляем соответствующий массив треков
      if (section === 'all') {
        setTracks(receivedTracks);
      } else if (section === 'popular') {
        setPopularTracks(receivedTracks);
      } else if (section === 'liked') {
        setLikedTracks(receivedTracks);
      } else if (section === 'new') {
        setNewTracks(receivedTracks);
      } else if (section === 'random') {
        setRandomTracks(receivedTracks);
      }
      
      setHasMoreTracks(receivedTracks.length >= 20);
      setPage(1);
      
      // Обновляем страницу для типа
      setPageByType(prev => ({ ...prev, [section]: 1 }));
      
    } catch (error) {
      console.error(`Ошибка при загрузке треков (${section}):`, error);
      Alert.alert('Ошибка', 'Не удалось загрузить треки. Проверьте подключение к интернету.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Загрузка дополнительных треков (пагинация)
  const loadMoreTracks = async () => {
    if (!hasMoreTracks || isLoading) return;
    
    try {
      setIsLoading(true);
      
      const nextPage = pageByType[currentSection] + 1;
      let endpoint = '/api/music';
      let params = { page: nextPage, per_page: 20 };
      
      // Выбираем эндпоинт в зависимости от раздела
      if (currentSection === 'liked') {
        endpoint = '/api/music/liked';
      } else if (currentSection === 'popular') {
        params.sort = 'popular';
      } else if (currentSection === 'new') {
        params.sort = 'date';
      } else if (currentSection === 'random') {
        endpoint = '/api/music/random';
      }
      
      const response = await api.get(endpoint, { params });
      
      const newLoadedTracks = response.data.tracks || [];
      
      // Обновляем соответствующий массив треков
      if (currentSection === 'all') {
        setTracks(prevTracks => [...prevTracks, ...newLoadedTracks]);
      } else if (currentSection === 'popular') {
        setPopularTracks(prevTracks => [...prevTracks, ...newLoadedTracks]);
      } else if (currentSection === 'liked') {
        setLikedTracks(prevTracks => [...prevTracks, ...newLoadedTracks]);
      } else if (currentSection === 'new') {
        setNewTracks(prevTracks => [...prevTracks, ...newLoadedTracks]);
      } else if (currentSection === 'random') {
        setRandomTracks(prevTracks => [...prevTracks, ...newLoadedTracks]);
      }
      
      setHasMoreTracks(newLoadedTracks.length >= 20);
      
      // Обновляем страницу для типа
      setPageByType(prev => ({ ...prev, [currentSection]: nextPage }));
      
    } catch (error) {
      console.error('Ошибка при загрузке дополнительных треков:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Лайк/дизлайк трека
  const toggleLike = async (trackId) => {
    try {
      const response = await api.post(`/api/music/${trackId}/like`);
      
      if (response.data.success) {
        const isLiked = response.data.is_liked;
        
        // Функция для обновления трека в списке
        const updateTrackInList = (list) => {
          return list.map(track => {
            if (track.id === trackId) {
              return {
                ...track,
                is_liked: isLiked,
                likes_count: isLiked 
                  ? (track.likes_count || 0) + 1 
                  : Math.max(0, (track.likes_count || 0) - 1)
              };
            }
            return track;
          });
        };
        
        // Обновляем все списки треков
        setTracks(updateTrackInList(tracks));
        setPopularTracks(updateTrackInList(popularTracks));
        setNewTracks(updateTrackInList(newTracks));
        setRandomTracks(updateTrackInList(randomTracks));
        
        // Если трек был удален из избранного, удаляем его из списка лайкнутых
        if (!isLiked) {
          setLikedTracks(likedTracks.filter(track => track.id !== trackId));
        } else {
          // Если трек был добавлен в избранное
          const trackToAdd = tracks.find(track => track.id === trackId) ||
                            popularTracks.find(track => track.id === trackId) ||
                            newTracks.find(track => track.id === trackId) ||
                            randomTracks.find(track => track.id === trackId);
          
          if (trackToAdd && !likedTracks.some(track => track.id === trackId)) {
            setLikedTracks([{ ...trackToAdd, is_liked: true }, ...likedTracks]);
          }
        }
        
        // Обновляем текущий трек, если это он
        if (currentTrack && currentTrack.id === trackId) {
          setCurrentTrack({
            ...currentTrack,
            is_liked: isLiked,
            likes_count: isLiked 
              ? (currentTrack.likes_count || 0) + 1 
              : Math.max(0, (currentTrack.likes_count || 0) - 1)
          });
        }
        
        return isLiked;
      }
      return null;
    } catch (error) {
      console.error('Ошибка при добавлении/удалении лайка:', error);
      Alert.alert('Ошибка', 'Не удалось обновить статус избранного');
      return null;
    }
  };
  
  // Поиск треков
  const searchTracks = async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await api.get(`/api/music/search?query=${encodeURIComponent(query.trim())}`);
      
      const tracks = response.data.tracks || response.data || [];
      setSearchResults(tracks);
      return tracks;
    } catch (error) {
      console.error('Ошибка при поиске треков:', error);
      Alert.alert('Ошибка', 'Не удалось выполнить поиск');
      return [];
    } finally {
      setIsSearching(false);
    }
  };
  
  // Воспроизведение трека
  const playTrack = async (track) => {
    try {
      // Если выбран текущий трек - просто переключаем воспроизведение
      if (currentTrack && track.id === currentTrack.id) {
        return togglePlayback();
      }
      
      // Останавливаем текущий трек
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      
      setCurrentTrack(track);
      setIsPlaying(false);
      setIsLoading(true);
      
      // Сохраняем трек в AsyncStorage
      await AsyncStorage.setItem('lastTrack', JSON.stringify(track));
      
      // Создаем новый звуковой объект
      const audioUri = track.file_path.startsWith('http') 
        ? track.file_path 
        : `https://k-connect.ru${track.file_path}`;
        
      console.log('Воспроизведение аудио:', audioUri);
      
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { 
          shouldPlay: true,
          volume: volume,
          progressUpdateIntervalMillis: 500
        },
        onPlaybackStatusUpdate
      );
      
      soundRef.current = sound;
      
      // Начинаем воспроизведение
      await sound.playAsync();
      
      // Отправляем данные о воспроизведении на сервер
      try {
        // Отправляем статистику если трек полностью загружен
        if (sound && status && status.isLoaded) {
          api.post(`/api/music/${track.id}/play`)
            .catch(error => {
              // Тихо логируем ошибку, без всплывающих уведомлений
              console.log('Ошибка статистики воспроизведения:', error.message);
            });
        }
      } catch (playError) {
        // Игнорируем ошибки статистики - они не влияют на воспроизведение
      }
      
    } catch (error) {
      console.error('Ошибка при воспроизведении трека:', error);
      Alert.alert('Ошибка', 'Не удалось воспроизвести трек');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Переключение воспроизведения (пауза/продолжить)
  const togglePlayback = async () => {
    if (!soundRef.current) return;
    
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Ошибка при переключении воспроизведения:', error);
    }
  };
  
  // Перемотка к определенной позиции
  const seekTo = async (millis) => {
    if (!soundRef.current) return;
    
    try {
      await soundRef.current.setPositionAsync(millis);
    } catch (error) {
      console.error('Ошибка при перемотке:', error);
    }
  };
  
  // Переход к следующему треку
  const playNextTrack = () => {
    if (!currentTrack) return;
    
    // Выбираем массив треков в зависимости от текущего раздела
    let trackList;
    switch (currentSection) {
      case 'popular':
        trackList = popularTracks;
        break;
      case 'liked':
        trackList = likedTracks;
        break;
      case 'new':
        trackList = newTracks;
        break;
      case 'random':
        trackList = randomTracks;
        break;
      case 'search':
        trackList = searchResults;
        break;
      default:
        trackList = tracks;
    }
    
    if (!trackList || trackList.length === 0) return;
    
    // Находим индекс текущего трека
    const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex === -1) {
      // Если трек не найден, воспроизводим первый трек
      if (trackList.length > 0) {
        playTrack(trackList[0]);
      }
      return;
    }
    
    // Переходим к следующему треку или к первому, если достигли конца
    const nextIndex = (currentIndex + 1) % trackList.length;
    playTrack(trackList[nextIndex]);
  };
  
  // Переход к предыдущему треку
  const playPrevTrack = () => {
    if (!currentTrack) return;
    
    // Если прошло менее 3 секунд, переходим к предыдущему треку
    // Иначе перезапускаем текущий
    if (position > 3000) {
      seekTo(0);
      return;
    }
    
    // Выбираем массив треков в зависимости от текущего раздела
    let trackList;
    switch (currentSection) {
      case 'popular':
        trackList = popularTracks;
        break;
      case 'liked':
        trackList = likedTracks;
        break;
      case 'new':
        trackList = newTracks;
        break;
      case 'random':
        trackList = randomTracks;
        break;
      case 'search':
        trackList = searchResults;
        break;
      default:
        trackList = tracks;
    }
    
    if (!trackList || trackList.length === 0) return;
    
    // Находим индекс текущего трека
    const currentIndex = trackList.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex === -1) {
      // Если трек не найден, воспроизводим последний трек
      if (trackList.length > 0) {
        playTrack(trackList[trackList.length - 1]);
      }
      return;
    }
    
    // Переходим к предыдущему треку или к последнему, если в начале списка
    const prevIndex = (currentIndex - 1 + trackList.length) % trackList.length;
    playTrack(trackList[prevIndex]);
  };
  
  // Изменение громкости
  const changeVolume = async (value) => {
    if (!soundRef.current) return;
    
    try {
      await soundRef.current.setVolumeAsync(value);
      setVolume(value);
    } catch (error) {
      console.error('Ошибка при изменении громкости:', error);
    }
  };
  
  // Форматирование времени из миллисекунд в мм:сс
  const formatTime = (millis) => {
    if (!millis || isNaN(millis)) return '0:00';
    
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Обработчик обновления статуса воспроизведения
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setPosition(status.positionMillis || 0);
      
      // Убедимся, что у нас есть валидная длительность
      if (status.durationMillis && status.durationMillis > 0) {
        setDuration(status.durationMillis);
      }
      
      // Если трек закончился, переходим к следующему
      if (status.didJustFinish) {
        playNextTrack();
      }
    }
  };
  
  // Восстановление последнего воспроизведенного трека
  const restoreLastTrack = async () => {
    try {
      const lastTrackJson = await AsyncStorage.getItem('lastTrack');
      
      if (lastTrackJson) {
        const track = JSON.parse(lastTrackJson);
        setCurrentTrack(track);
        // Не запускаем воспроизведение автоматически
      }
    } catch (error) {
      console.error('Ошибка при восстановлении последнего трека:', error);
    }
  };
  
  // Получение текущего списка треков в зависимости от раздела
  const getCurrentTracks = () => {
    switch (currentSection) {
      case 'popular':
        return popularTracks;
      case 'liked':
        return likedTracks;
      case 'new':
        return newTracks;
      case 'random':
        return randomTracks;
      case 'search':
        return searchResults;
      default:
        return tracks;
    }
  };
  
  // Значение контекста
  const value = {
    tracks,
    popularTracks,
    likedTracks,
    newTracks,
    randomTracks,
    currentTrack,
    isPlaying,
    duration,
    position,
    volume,
    isLoading,
    isSearching,
    currentSection,
    searchResults,
    hasMoreTracks,
    
    // Функции для треков
    fetchTracks,
    loadMoreTracks,
    toggleLike,
    searchTracks,
    getCurrentTracks,
    
    // Функции для плеера
    playTrack,
    togglePlayback,
    seekTo,
    playNextTrack,
    playPrevTrack,
    changeVolume,
    formatTime,
    
    // Функции для раздела
    setCurrentSection
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// Хук для использования музыкального контекста
export const useMusic = () => useContext(MusicContext); 