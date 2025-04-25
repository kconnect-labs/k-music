import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StatusBar,
  Dimensions,
  ImageBackground 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles/theme';
import { APP_STRINGS } from '../constants/strings';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMusic } from '../contexts/MusicContext';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const { likedTracks } = useMusic();
  const [stats, setStats] = useState({
    plays: 0,
    likes: likedTracks?.length || 0,
    followers: 0,
    following: 0
  });

  // Имитация загрузки статистики
  useEffect(() => {
    const randomStats = {
      plays: Math.floor(Math.random() * 100),
      followers: Math.floor(Math.random() * 20),
      following: Math.floor(Math.random() * 15)
    };
    
    setStats(prev => ({
      ...prev,
      ...randomStats,
      likes: likedTracks?.length || 0
    }));
  }, [likedTracks]);

  const ActionCard = ({ icon, title, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.actionCard, SHADOWS.MEDIUM]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[color, COLORS.CARD_BACKGROUND]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionCardGradient}
      >
        <Ionicons name={icon} size={28} color={COLORS.TEXT_PRIMARY} />
        <Text style={styles.actionCardText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'left', 'top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Шапка профиля */}
        <LinearGradient
          colors={[COLORS.PRIMARY_DARK, COLORS.BACKGROUND]}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              {user?.photo ? (
                <Image 
                  source={{ uri: user.photo.startsWith('http') 
                    ? user.photo 
                    : `https://k-connect.ru/static/uploads/avatar/${user.id}/${user.photo}` 
                  }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileInitials}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Text>
                </View>
              )}
              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name || 'Пользователь'}</Text>
              <Text style={styles.profileUsername}>@{user?.username || 'user'}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.plays}</Text>
              <Text style={styles.statLabel}>{APP_STRINGS.PLAYS}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.likes}</Text>
              <Text style={styles.statLabel}>{APP_STRINGS.FAVORITES}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.followers}</Text>
              <Text style={styles.statLabel}>{APP_STRINGS.FOLLOWERS}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.following}</Text>
              <Text style={styles.statLabel}>{APP_STRINGS.FOLLOWING}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Раздел действий */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{APP_STRINGS.ACTIONS}</Text>
          <View style={styles.actionCardsContainer}>
            <ActionCard 
              icon="musical-notes"
              title={APP_STRINGS.MY_MUSIC}
              color={COLORS.PRIMARY}
              onPress={() => {}}
            />
            <ActionCard 
              icon="heart"
              title={APP_STRINGS.FAVORITES}
              color="#F43F5E"
              onPress={() => {}}
            />
            <ActionCard 
              icon="download"
              title={APP_STRINGS.DOWNLOADS}
              color="#10B981"
              onPress={() => {}}
            />
            <ActionCard 
              icon="settings"
              title={APP_STRINGS.SETTINGS}
              color="#0EA5E9"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Информация о профиле */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{APP_STRINGS.PROFILE}</Text>
          <View style={[styles.profileCard, SHADOWS.MEDIUM]}>
            {user?.about && (
              <View style={styles.profileInfoItem}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.profileInfoText}>{user.about}</Text>
              </View>
            )}
            <View style={styles.profileInfoItem}>
              <Ionicons name="mail-outline" size={20} color={COLORS.TEXT_SECONDARY} />
              <Text style={styles.profileInfoText}>{user?.email || 'Email не указан'}</Text>
            </View>
            {user?.telegram_username && (
              <View style={styles.profileInfoItem}>
                <Ionicons name="logo-telegram" size={20} color={COLORS.TEXT_SECONDARY} />
                <Text style={styles.profileInfoText}>@{user.telegram_username}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Кнопка выхода */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.BACKGROUND} style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>{APP_STRINGS.LOGOUT}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
  },
  profileImagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.CARD_BACKGROUND,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981', // Зеленый для "онлайн"
    borderWidth: 2,
    borderColor: COLORS.BACKGROUND,
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  profileName: {
    fontSize: FONTS.X_LARGE,
    fontWeight: FONTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: FONTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginTop: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.LARGE,
    fontWeight: FONTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
  },
  statLabel: {
    fontSize: FONTS.SMALL,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 2,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: FONTS.LARGE,
    fontWeight: FONTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 15,
  },
  actionCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    height: 100,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionCardGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCardText: {
    fontSize: FONTS.MEDIUM,
    fontWeight: FONTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginTop: 8,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 16,
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInfoText: {
    fontSize: FONTS.MEDIUM,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: 10,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: SIZES.RADIUS,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: FONTS.MEDIUM,
    fontWeight: FONTS.BOLD,
  },
});

export default HomeScreen; 