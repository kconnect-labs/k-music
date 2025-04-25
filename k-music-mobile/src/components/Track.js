import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusic } from '../contexts/MusicContext';
import { COLORS, SHADOWS, FONTS } from '../styles/theme';
import { EMPTY_IMAGE } from '../../assets/default-cover.js';

const Track = ({ track, onPress }) => {
  const { currentTrack, isPlaying, playTrack, toggleLike } = useMusic();
  
  // Проверяем, играет ли этот трек сейчас
  const isCurrentTrack = currentTrack && currentTrack.id === track.id;
  
  // Формируем URL обложки или используем изображение по умолчанию
  const coverSource = track.cover_path
    ? (track.cover_path.startsWith('http')
        ? { uri: track.cover_path }
        : { uri: `https://k-connect.ru${track.cover_path}` })
    : { uri: EMPTY_IMAGE };
  
  // Обработчик нажатия на трек
  const handlePress = () => {
    if (onPress) {
      onPress(track);
    } else {
      playTrack(track);
    }
  };
  
  // Обработчик нажатия на кнопку лайка
  const handleLikePress = async (e) => {
    e.stopPropagation();
    if (track.id) {
      await toggleLike(track.id);
    }
  };
  
  // Проверяем наличие валидной длительности трека
  const hasDuration = track.duration_formatted && track.duration_formatted !== '0:00';
  
  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity 
        style={[
          styles.container, 
          SHADOWS.SMALL,
          isCurrentTrack && styles.currentTrackContainer
        ]} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.coverContainer}>
          {coverSource ? (
            <Image source={coverSource} style={styles.cover} />
          ) : (
            <View style={[styles.cover, { backgroundColor: COLORS.CARD_BACKGROUND, justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="musical-note" size={24} color={COLORS.TEXT_SECONDARY} />
            </View>
          )}
          {isCurrentTrack && isPlaying && (
            <View style={styles.playingIndicator}>
              <Ionicons name="play" size={16} color="#FFFFFF" />
            </View>
          )}
        </View>
        
        <View style={styles.info}>
          <Text style={[styles.title, isCurrentTrack && styles.activeText]} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {track.artist}
          </Text>
          
          {hasDuration && (
            <Text style={styles.duration}>
              {track.duration_formatted}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={handleLikePress}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons 
            name={track.is_liked ? 'heart' : 'heart-outline'} 
            size={22} 
            color={track.is_liked ? '#F43F5E' : COLORS.TEXT_SECONDARY} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 10,
    marginHorizontal: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  currentTrackContainer: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
  coverContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.CARD_BACKGROUND,
  },
  playingIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: FONTS.MEDIUM,
    fontWeight: FONTS.BOLD,
    marginBottom: 3,
  },
  activeText: {
    color: COLORS.PRIMARY,
  },
  artist: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONTS.SMALL,
    marginBottom: 2,
  },
  duration: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONTS.TINY,
  },
  likeButton: {
    padding: 8,
  }
});

export default Track; 