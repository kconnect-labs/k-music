import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../contexts/MusicContext';
import { COLORS, FONTS, SIZES, SHADOWS } from '../styles/theme';
import { APP_STRINGS } from '../constants/strings';

const SettingsScreen = () => {
  const { logout, user } = useAuth();
  const { changeVolume, volume } = useMusic();
  
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [downloadOverWifi, setDownloadOverWifi] = useState(true);
  
  const handleLogout = async () => {
    Alert.alert(
      'Выйти из аккаунта',
      'Вы уверены, что хотите выйти?',
      [
        {
          text: 'Отмена',
          style: 'cancel'
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
            } catch (error) {
              console.error('Ошибка при выходе:', error);
              Alert.alert('Ошибка', 'Не удалось выйти из аккаунта. Попробуйте снова.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const renderSettingItem = (icon, title, description, value, onToggle, color = COLORS.TEXT_PRIMARY) => {
    return (
      <View style={styles.settingItem}>
        <View style={[styles.settingIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.INPUT_BACKGROUND, true: COLORS.PRIMARY }}
          thumbColor={value ? COLORS.PRIMARY_LIGHT : COLORS.BORDER}
          ios_backgroundColor={COLORS.INPUT_BACKGROUND}
        />
      </View>
    );
  };
  
  const renderSettingCategory = (title) => {
    return (
      <View style={styles.settingCategory}>
        <Text style={styles.settingCategoryTitle}>{title}</Text>
      </View>
    );
  };
  
  const renderActionItem = (icon, title, description, onPress, color = COLORS.TEXT_PRIMARY, destructive = false) => {
    return (
      <TouchableOpacity style={styles.settingItem} onPress={onPress}>
        <View style={[styles.settingIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, destructive && { color: COLORS.DANGER }]}>{title}</Text>
          {description && <Text style={styles.settingDescription}>{description}</Text>}
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={COLORS.TEXT_SECONDARY} />
      </TouchableOpacity>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{APP_STRINGS.SETTINGS}</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Пользователь'}</Text>
            <Text style={styles.profileUsername}>@{user?.username || 'username'}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => {}}
          >
            <Text style={styles.editProfileText}>Редактировать</Text>
          </TouchableOpacity>
        </View>
        


        {renderSettingCategory('Аккаунт')}
        
        {renderActionItem(
          'person-outline',
          'Мой аккаунт',
          'Управление аккаунтом и личные данные',
          () => {},
          COLORS.PRIMARY
        )}
        

        {renderActionItem(
          'log-out-outline',
          'Выйти из аккаунта',
          '',
          handleLogout,
          COLORS.PRIMARY,
          true
        )}
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Версия 0.1.0</Text>
        </View>
      </ScrollView>
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 8,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 12,
    marginHorizontal: 16,
    ...SHADOWS.medium,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  editProfileButton: {
    backgroundColor: COLORS.PRIMARY_DARK,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editProfileText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  settingCategory: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 8,
  },
  settingCategoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.CARD_BACKGROUND,
    marginVertical: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default SettingsScreen; 