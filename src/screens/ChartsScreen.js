import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMusic } from '../contexts/MusicContext';
import Track from '../components/Track';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles/theme';
import api from '../services/api';

const ChartsScreen = () => {
  const { playTrack } = useMusic();
  const [chartTracks, setChartTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Load charts data on component mount
  useEffect(() => {
    fetchCharts();
  }, []);

  // Fetch charts data from API
  const fetchCharts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/music/charts');
      setChartTracks(response.data.tracks || []);
    } catch (error) {
      console.error('Error fetching charts:', error);
      setError('Не удалось загрузить чарты. Попробуйте позже.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCharts();
  };

  // Render chart header
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Музыкальные чарты</Text>
          <Text style={styles.headerSubtitle}>
            Самые популярные треки у пользователей
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="play" size={18} color={COLORS.WHITE} />
              <Text style={styles.statText}>Популярные</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={18} color={COLORS.WHITE} />
              <Text style={styles.statText}>Обновлено сегодня</Text>
            </View>
          </View>
        </View>
        <Ionicons name="stats-chart" size={64} color="rgba(255,255,255,0.2)" style={styles.headerIcon} />
      </LinearGradient>
    </View>
  );

  // Render empty state
  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.emptyText}>Загрузка чартов...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.DANGER} />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchCharts}
          >
            <Text style={styles.retryText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="musical-notes" size={48} color={COLORS.TEXT_SECONDARY} />
        <Text style={styles.emptyText}>Чарты пока недоступны</Text>
        <Text style={styles.emptySubtext}>Мы работаем над тем, чтобы показывать вам самую популярную музыку.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <FlatList
        data={chartTracks}
        keyExtractor={(item) => `chart-track-${item.id}`}
        renderItem={({ item, index }) => (
          <Track 
            track={item} 
            index={index} 
            onPress={playTrack} 
            showDuration={true}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={chartTracks.length === 0 ? renderEmpty : null}
        contentContainerStyle={[
          styles.listContent,
          chartTracks.length === 0 && styles.emptyListContent
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  listContent: {
    padding: SIZES.PADDING,
    paddingBottom: 100,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: SIZES.PADDING,
    borderRadius: SIZES.RADIUS,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  headerGradient: {
    padding: SIZES.PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.LARGE,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: SIZES.SMALL,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  headerIcon: {
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.PADDING,
  },
  statText: {
    color: COLORS.WHITE,
    fontSize: SIZES.SMALL,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.PADDING * 2,
  },
  emptyText: {
    fontSize: SIZES.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: SIZES.PADDING,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: 8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: SIZES.RADIUS_SMALL,
  },
  retryText: {
    color: COLORS.WHITE,
    fontSize: SIZES.SMALL,
  },
});

export default ChartsScreen; 