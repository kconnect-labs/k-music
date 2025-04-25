import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles/theme';
import Track from '../components/Track';
import { useMusic } from '../contexts/MusicContext';
import { useAuth } from '../context/AuthContext';
import { APP_STRINGS } from '../constants/strings';

const ProfileScreen = ({ navigation }) => {
  const { getLikedTracks } = useMusic();
  const { user } = useAuth();
  const { likedTracks } = useMusic();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: user?.name || 'Пользователь',
    username: user?.username || 'user',
    avatar: user?.photo || null,
    banner: user?.banner || null,
    likedTracks: [],
    about: user?.about || '',
    telegram_username: user?.telegram_username || ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (user) {
          setUserData({
            name: user.name || 'Пользователь',
            username: user.username || 'user',
            avatar: user.photo || null,
            banner: user.banner || null,
            about: user.about || '',
            telegram_username: user.telegram_username || '',
            likedTracks: likedTracks || []
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, likedTracks]);

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const renderTrackItem = ({ item }) => (
    <Track track={item} />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND} />
      
      <View style={styles.header}>
        <View style={styles.headerButton} />
        <Text style={styles.headerTitle}>Профиль</Text>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          {userData.banner ? (
            <Image 
              source={{ uri: userData.banner.startsWith('http') 
                ? userData.banner 
                : `https://k-connect.ru/static/uploads/banner/${user?.id}/${userData.banner}` 
              }} 
              style={styles.banner} 
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={[COLORS.PRIMARY_DARK, COLORS.BACKGROUND]}
              style={styles.bannerGradient}
            />
          )}
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {userData.avatar ? (
              <Image 
                source={{ uri: userData.avatar.startsWith('http') 
                  ? userData.avatar 
                  : `https://k-connect.ru/static/uploads/avatar/${user?.id}/${userData.avatar}` 
                }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileInitials}>
                  {getInitials(userData.name)}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileUsername}>@{userData.username}</Text>
            
            {userData.likedTracks && userData.likedTracks.length > 0 && (
              <View style={styles.favoritesBubble}>
                <Ionicons name="heart" size={14} color={COLORS.BACKGROUND} />
                <Text style={styles.favoritesBubbleText}>{userData.likedTracks.length}</Text>
              </View>
            )}
          </View>
        </View>

        {userData.about || userData.telegram_username ? (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{APP_STRINGS.PROFILE}</Text>
            <View style={[styles.profileCard, SHADOWS.MEDIUM]}>
              {userData.about && (
                <View style={styles.profileInfoItem}>
                  <Ionicons name="information-circle-outline" size={20} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.profileInfoText}>{userData.about}</Text>
                </View>
              )}
              {userData.telegram_username && (
                <View style={styles.profileInfoItem}>
                  <Ionicons name="logo-telegram" size={20} color={COLORS.TEXT_SECONDARY} />
                  <Text style={styles.profileInfoText}>@{userData.telegram_username}</Text>
                </View>
              )}
            </View>
          </View>
        ) : null}

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Любимые треки</Text>
          
          <View style={styles.trackListContainer}>
            {userData.likedTracks && userData.likedTracks.length > 0 ? (
              <FlatList
                data={userData.likedTracks}
                renderItem={renderTrackItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="heart-outline" size={48} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.emptyStateText}>У вас пока нет любимых треков</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.PADDING,
    paddingVertical: SIZES.PADDING_SMALL,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.LARGE,
    fontWeight: FONTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    width: '100%',
    height: 180,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    width: '100%',
    height: '100%',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.PADDING,
    marginTop: -40,
  },
  profileImageContainer: {
    marginRight: SIZES.PADDING,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.BACKGROUND,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.PRIMARY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.BACKGROUND,
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  profileInfo: {
    justifyContent: 'center',
    marginTop: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  profileUsername: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  favoritesBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  favoritesBubbleText: {
    color: COLORS.BACKGROUND,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  sectionContainer: {
    marginTop: SIZES.PADDING,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: SIZES.PADDING,
    marginBottom: 12,
  },
  profileCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    marginHorizontal: SIZES.PADDING,
    borderRadius: SIZES.RADIUS,
    padding: SIZES.PADDING,
    marginBottom: SIZES.PADDING,
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  profileInfoText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    marginLeft: 12,
    lineHeight: 20,
  },
  trackListContainer: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    marginHorizontal: SIZES.PADDING,
    borderRadius: SIZES.RADIUS,
    overflow: 'hidden',
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: SIZES.PADDING * 2,
  },
  emptyStateText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
    marginTop: 12,
  },
  spacer: {
    height: 100,
  }
});

export default ProfileScreen; 