import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  StatusBar,
  Image,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Track from '../components/Track';
import MusicPlayer from '../components/MusicPlayer';
import { useMusic } from '../contexts/MusicContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles/theme';
import { APP_STRINGS } from '../constants/strings';

const { width } = Dimensions.get('window');

const sections = [
  { id: 'all', title: APP_STRINGS.ALL_TRACKS },
  { id: 'popular', title: APP_STRINGS.POPULAR },
  { id: 'liked', title: APP_STRINGS.FAVORITES },
  { id: 'new', title: APP_STRINGS.NEW },
  { id: 'random', title: APP_STRINGS.RANDOM },
];

const MusicScreen = () => {
  const {
    tracks,
    popularTracks,
    likedTracks,
    newTracks,
    randomTracks,
    currentTrack,
    isLoading,
    searchResults,
    isSearching,
    fetchTracks,
    loadMoreTracks,
    searchTracks,
    playTrack,
    currentSection,
    setCurrentSection,
    hasMoreTracks,
    getCurrentTracks
  } = useMusic();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [showAllTracks, setShowAllTracks] = useState(false);
  
  const listRef = useRef(null);
  const searchTimeout = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -120],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.8, 0.6],
    extrapolate: 'clamp',
  });
  
  const titleScale = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });
  
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 80],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  useEffect(() => {
    loadAllData();
  }, []);
  
  const loadAllData = async () => {
    setRefreshing(true);
    
    try {
      await fetchTracks('all');
      
      await Promise.all([
        fetchTracks('popular'),
        fetchTracks('liked'),
        fetchTracks('new'),
        fetchTracks('random', { random: true })
      ]);
    } catch (error) {
      console.error('Error loading all music data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить все данные. Пожалуйста, попробуйте позже.');
    } finally {
      setRefreshing(false);
    }
  };
  
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (text.trim() === '') {
      setIsSearchMode(false);
    } else {
      setIsSearchMode(true);
      
      searchTimeout.current = setTimeout(() => {
        searchTracks(text);
      }, 500);
    }
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
  };
  
  const handleSectionPress = (sectionId) => {
    if (currentSection !== sectionId) {
      setCurrentSection(sectionId);
      setShowAllTracks(true);
      if (listRef.current) {
        listRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }
  };
  
  const handleEndReached = () => {
    if (!isLoading && hasMoreTracks && !isSearchMode && showAllTracks) {
      loadMoreTracks();
    }
  };
  
  const renderSectionItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.sectionItem,
        currentSection === item.id && styles.activeSectionItem
      ]}
      onPress={() => handleSectionPress(item.id)}
    >
      <Text 
        style={[
          styles.sectionTitle,
          currentSection === item.id && styles.activeSectionTitle
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );
  
  const renderFooter = () => {
    if (!isLoading || isSearchMode) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
        <Text style={styles.footerText}>{APP_STRINGS.LOADING_TRACKS}</Text>
      </View>
    );
  };

  const renderTrackRow = ({ item }) => (
    <Track track={item} onPress={playTrack} />
  );

  const renderPopularSection = () => {
    if (isSearchMode) return null;

    return (
      <View style={styles.musicSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Популярное</Text>
          <TouchableOpacity onPress={() => handleSectionPress('popular')}>
            <Text style={styles.seeAllText}>Все</Text>
          </TouchableOpacity>
        </View>

        {popularTracks && popularTracks.length > 0 ? (
          <FlatList
            horizontal
            data={popularTracks.slice(0, 10)}
            keyExtractor={(item) => `popular-${item.id}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                style={styles.popularCard}
                onPress={() => playTrack(item)}
              >
                {item.cover_url ? (
                  <Image 
                    source={{ uri: item.cover_url }} 
                    style={styles.popularCover}
                    defaultSource={require('../assets/images/default-cover.png')}
                  />
                ) : (
                  <View style={styles.popularCoverPlaceholder}>
                    <Ionicons name="musical-note" size={24} color={COLORS.WHITE} />
                  </View>
                )}
                <View style={styles.popularInfo}>
                  <Text style={styles.popularTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.popularArtist} numberOfLines={1}>{item.artist}</Text>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            <Text style={styles.emptyText}>Загрузка...</Text>
          </View>
        )}
      </View>
    );
  };

  const renderNewReleasesSection = () => {
    if (isSearchMode) return null;

    return (
      <View style={styles.musicSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Новинки</Text>
          <TouchableOpacity onPress={() => handleSectionPress('new')}>
            <Text style={styles.seeAllText}>Все</Text>
          </TouchableOpacity>
        </View>

        {newTracks && newTracks.length > 0 ? (
          <FlatList
            data={newTracks.slice(0, 5)}
            keyExtractor={(item) => `new-${item.id}`}
            renderItem={renderTrackRow}
            scrollEnabled={false}
            contentContainerStyle={styles.newReleasesList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="small" color={COLORS.PRIMARY} />
            <Text style={styles.emptyText}>Загрузка...</Text>
          </View>
        )}
      </View>
    );
  };

  const renderRandomTracksSection = () => {
    if (isSearchMode) return null;

    return (
      <View style={styles.musicSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderTitle}>Для вас</Text>
          <TouchableOpacity onPress={() => handleSectionPress('random')}>
            <Text style={styles.seeAllText}>Все</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.randomGrid}>
          {randomTracks && randomTracks.length > 0 ? 
            randomTracks.slice(0, 6).map((track) => (
              <TouchableOpacity 
                key={`random-${track.id}`}
                style={styles.randomCard}
                onPress={() => playTrack(track)}
              >
                {track.cover_url ? (
                  <Image 
                    source={{ uri: track.cover_url }} 
                    style={styles.randomCover}
                    defaultSource={require('../assets/images/default-cover.png')}
                  />
                ) : (
                  <View style={styles.randomCoverPlaceholder}>
                    <Ionicons name="musical-note" size={24} color={COLORS.WHITE} />
                  </View>
                )}
                <Text style={styles.randomTitle} numberOfLines={1}>{track.title}</Text>
                <Text style={styles.randomArtist} numberOfLines={1}>{track.artist}</Text>
              </TouchableOpacity>
            )) : (
              <View style={styles.emptyContainer}>
                <ActivityIndicator size="small" color={COLORS.PRIMARY} />
                <Text style={styles.emptyText}>Загрузка...</Text>
              </View>
            )
          }
        </View>
      </View>
    );
  };
  
  const renderListHeader = () => {
    if (isSearchMode && searchResults.length > 0) {
      return (
        <View style={styles.listHeader}>
          <TouchableOpacity style={styles.backButton} onPress={clearSearch}>
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.listHeaderTitle}>
            {`${APP_STRINGS.SEARCH_RESULTS}: ${searchResults.length}`}
          </Text>
        </View>
      );
    }
    
    if (isSearchMode && searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.emptyText}>
            {isSearching ? APP_STRINGS.SEARCHING : APP_STRINGS.NO_RESULTS}
          </Text>
        </View>
      );
    }

    if (showAllTracks) {
      return (
        <View style={styles.listHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowAllTracks(false)}>
            <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.listHeaderTitle}>
            {sections.find(s => s.id === currentSection)?.title || "Музыка"}
          </Text>
        </View>
      );
    }
    
    return (
      <>
        {renderPopularSection()}
        {renderNewReleasesSection()}
        {renderRandomTracksSection()}
      </>
    );
  };
  
  const displayTracks = isSearchMode ? searchResults : getCurrentTracks();
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const handleGoBack = () => {
    if (isSearchMode) {
      clearSearch();
    } else if (showAllTracks) {
      setShowAllTracks(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND} />
      
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: fadeAnim
          }
        ]}
      >
        <LinearGradient
          colors={[COLORS.CARD_BACKGROUND, COLORS.BACKGROUND]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <Animated.Text 
            style={[
              styles.headerTitle, 
              { 
                opacity: titleOpacity,
                transform: [{ scale: titleScale }] 
              }
            ]}
          >
            {APP_STRINGS.MUSIC}
          </Animated.Text>
          
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={COLORS.TEXT_SECONDARY}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={APP_STRINGS.SEARCH_TRACKS}
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </Animated.View>
      
      {!isSearchMode && !showAllTracks && (
        <Animated.View 
          style={[
            styles.sectionsContainer,
            { zIndex: 98, transform: [{ translateY: headerTranslateY }] }
          ]}
        >
          <FlatList
            horizontal
            data={sections}
            renderItem={renderSectionItem}
            keyExtractor={(item) => `section-${item.id}`}
            showsHorizontalScrollIndicator={false}
            style={styles.sectionsList}
            contentContainerStyle={styles.sectionsContent}
          />
        </Animated.View>
      )}
      
      <Animated.FlatList
        ref={listRef}
        data={isSearchMode || showAllTracks ? displayTracks : []}
        renderItem={({ item }) => (
          <Track track={item} onPress={playTrack} />
        )}
        keyExtractor={(item) => `track-${item.id.toString()}`}
        contentContainerStyle={[
          styles.tracksList,
          {paddingBottom: currentTrack ? 130 : 80}
        ]}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          (!isSearchMode && !showAllTracks) ? null : (
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes" size={48} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.emptyText}>
                {isLoading ? APP_STRINGS.LOADING_TRACKS : APP_STRINGS.NO_TRACKS}
              </Text>
            </View>
          )
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
        bounces={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
          />
        }
      />
      
      {currentTrack && (
        <MusicPlayer 
          minimized={!showFullPlayer} 
          onMaximize={() => setShowFullPlayer(true)} 
          onMinimize={() => setShowFullPlayer(false)}
        />
      )}
      
      <Modal
        visible={showFullPlayer}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFullPlayer(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowFullPlayer(false)}
          >
            <Ionicons name="chevron-down" size={30} color={COLORS.TEXT_PRIMARY} />
          </TouchableOpacity>
          <MusicPlayer minimized={false} />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    height: 200,
    overflow: 'hidden',
    zIndex: 100,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  sectionsContainer: {
    elevation: 10,
    zIndex: 99,
    backgroundColor: COLORS.BACKGROUND,
  },
  sectionsList: {
    maxHeight: 48,
    backgroundColor: COLORS.BACKGROUND,
  },
  sectionsContent: {
    paddingHorizontal: 8,
  },
  sectionItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  activeSectionItem: {
    backgroundColor: COLORS.PRIMARY_DARK,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  activeSectionTitle: {
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  listHeaderTitle: {
    fontSize: 18,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: 'bold',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  tracksList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    color: COLORS.TEXT_SECONDARY,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 20,
  },
  emptyText: {
    color: COLORS.TEXT_SECONDARY,
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 16,
    zIndex: 10,
  },
  musicSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
  },
  popularList: {
    paddingVertical: 8,
  },
  popularCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.CARD_BACKGROUND,
    ...SHADOWS.medium,
  },
  popularCover: {
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  popularCoverPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularInfo: {
    padding: 12,
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  popularArtist: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  newReleasesList: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.CARD_BACKGROUND,
    ...SHADOWS.small,
  },
  randomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  randomCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.CARD_BACKGROUND,
    ...SHADOWS.medium,
  },
  randomCover: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  randomCoverPlaceholder: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  randomTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginTop: 8,
    marginHorizontal: 8,
  },
  randomArtist: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 8,
    marginHorizontal: 8,
  },
});

export default MusicScreen; 