import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import { useMusic } from '../contexts/MusicContext';
import { COLORS, SHADOWS } from '../styles/theme';
import { APP_STRINGS } from '../constants/strings';
import { EMPTY_IMAGE } from '../../assets/default-cover.js';

const { width, height } = Dimensions.get('window');

const MusicPlayer = ({ minimized = false, onMaximize, onMinimize }) => {
  const { 
    currentTrack, 
    isPlaying, 
    duration, 
    position, 
    togglePlayback, 
    seekTo, 
    playNextTrack, 
    playPrevTrack, 
    toggleLike, 
    formatTime 
  } = useMusic();
  
  // Локальные состояния
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const pan = useRef(new Animated.ValueXY()).current;
  
  // Настраиваем панреспондер для свайпа вниз
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return !minimized && Math.abs(gestureState.dy) > 20;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          y: pan.y._value,
          x: 0
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        
        // Если свайпнули достаточно вниз, то закрываем плеер
        if (gestureState.dy > 100) {
          Animated.spring(pan, {
            toValue: { x: 0, y: height },
            useNativeDriver: false
          }).start(() => {
            onMinimize();
            pan.setValue({ x: 0, y: 0 });
          });
        } else {
          // Иначе возвращаем на место
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false
          }).start();
        }
      }
    })
  ).current;
  
  // Эффект для анимации появления
  useEffect(() => {
    if (currentTrack) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [currentTrack]);
  
  if (!currentTrack) {
    return null; // Ничего не отображаем, если нет текущего трека
  }
  
  // Обработчики для слайдера
  const handleSeekStart = () => {
    setIsSeeking(true);
    setSeekPosition(position);
  };
  
  const handleSeekChange = (value) => {
    setSeekPosition(value);
  };
  
  const handleSeekComplete = (value) => {
    seekTo(value);
    setIsSeeking(false);
  };
  
  // Формируем URL обложки или используем изображение по умолчанию
  const coverSource = currentTrack && currentTrack.cover_path 
    ? (currentTrack.cover_path.startsWith('http') 
        ? { uri: currentTrack.cover_path } 
        : { uri: `https://k-connect.ru${currentTrack.cover_path}` })
    : { uri: EMPTY_IMAGE }; // Используем базовое изображение
  
  // Вычисляем текущий прогресс для слайдера
  const progress = isSeeking ? seekPosition : (position || 0);
  const displayDuration = duration || 1;
  
  // Если плеер минимизирован, показываем компактную версию
  if (minimized) {
    return (
      <TouchableOpacity 
        style={[styles.miniPlayerContainer, SHADOWS.MEDIUM]} 
        onPress={onMaximize}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.CARD_BACKGROUND, '#252040']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.miniGradient}
        >
          {coverSource ? (
            <Image 
              source={coverSource} 
              style={styles.miniCover} 
            />
          ) : (
            <View style={[styles.miniCover, { backgroundColor: COLORS.BACKGROUND_SECONDARY, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="musical-note" size={24} color={COLORS.TEXT_SECONDARY} />
            </View>
          )}
          
          <View style={styles.miniInfo}>
            <Text style={styles.miniTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.miniArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>
          
          <View style={styles.miniControls}>
            <TouchableOpacity 
              onPress={playPrevTrack}
              style={styles.miniButton}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Ionicons name="play-skip-back" size={20} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={togglePlayback}
              style={styles.miniPlayButton}
            >
              <Ionicons 
                name={isPlaying ? 'pause' : 'play'} 
                size={24} 
                color={COLORS.BACKGROUND} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={playNextTrack}
              style={styles.miniButton}
              hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
            >
              <Ionicons name="play-skip-forward" size={20} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        <View style={styles.miniProgressContainer}>
          <View 
            style={[
              styles.miniProgress, 
              { width: position && duration && duration > 0 ? `${(position / duration) * 100}%` : '0%' }
            ]} 
          />
        </View>
      </TouchableOpacity>
    );
  }
  
  // Полноразмерный плеер
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: pan.y }
          ]
        }
      ]}
      {...panResponder.panHandlers}
    >
      <LinearGradient
        colors={[COLORS.BACKGROUND, COLORS.CARD_BACKGROUND]}
        style={styles.gradient}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
        
        <View style={styles.coverContainer}>
          {coverSource ? (
            <Image 
              source={coverSource} 
              style={styles.cover} 
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cover, { backgroundColor: COLORS.CARD_BACKGROUND }]}>
              <Ionicons name="musical-note" size={60} color={COLORS.TEXT_SECONDARY} style={{ alignSelf: 'center', marginTop: 80 }} />
            </View>
          )}
          
          {isPlaying && (
            <View style={styles.playingIndicator}>
              <Ionicons name="musical-note" size={24} color="white" />
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.artist}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.currentTime}>{formatTime(progress)}</Text>
          <Slider
            style={styles.slider}
            value={progress}
            minimumValue={0}
            maximumValue={displayDuration}
            minimumTrackTintColor={COLORS.PRIMARY}
            maximumTrackTintColor="rgba(255,255,255,0.2)"
            thumbTintColor={COLORS.PRIMARY}
            onValueChange={handleSeekChange}
            onSlidingStart={handleSeekStart}
            onSlidingComplete={handleSeekComplete}
          />
          <Text style={styles.totalTime}>{formatTime(displayDuration)}</Text>
        </View>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            onPress={() => toggleLike(currentTrack.id)}
            style={styles.secondaryButton}
          >
            <Ionicons 
              name={currentTrack.is_liked ? "heart" : "heart-outline"} 
              size={24} 
              color={currentTrack.is_liked ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={playPrevTrack}
            style={styles.controlButton}
          >
            <Ionicons name="play-skip-back" size={28} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={togglePlayback}
            style={styles.playButton}
          >
            <LinearGradient
              colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
              style={styles.playButtonGradient}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={36} 
                color="white" 
              />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={playNextTrack}
            style={styles.controlButton}
          >
            <Ionicons name="play-skip-forward" size={28} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="shuffle" size={24} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.extraControlsContainer}>
          <TouchableOpacity style={styles.extraButton}>
            <Ionicons name="repeat" size={22} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.extraButtonText}>{APP_STRINGS.REPEAT}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.extraButton}>
            <Ionicons name="list" size={22} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.extraButtonText}>{APP_STRINGS.PLAYLIST}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.extraButton}>
            <Ionicons name="share-social-outline" size={22} color={COLORS.TEXT_SECONDARY} />
            <Text style={styles.extraButtonText}>{APP_STRINGS.SHARE}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20,
    paddingTop: 10, // Уменьшаем верхний отступ для индикатора свайпа
    paddingBottom: 40,
  },
  // Добавляем стили для индикатора свайпа (ручки)
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  cover: {
    width: width - 80,
    height: width - 80,
    borderRadius: 20,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  playingIndicator: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  artist: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  currentTime: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginRight: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  totalTime: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginLeft: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  secondaryButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35,
  },
  extraControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  extraButton: {
    alignItems: 'center',
    padding: 10,
  },
  extraButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 6,
  },
  // Стили для мини-плеера
  miniPlayerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    zIndex: 999,
  },
  miniGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  miniCover: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  miniInfo: {
    flex: 1,
    marginLeft: 12,
  },
  miniTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  miniArtist: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 12,
    marginTop: 2,
  },
  miniControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniButton: {
    padding: 8,
  },
  miniPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  miniProgressContainer: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  miniProgress: {
    height: 2,
    backgroundColor: COLORS.PRIMARY,
  },
});

export default MusicPlayer;