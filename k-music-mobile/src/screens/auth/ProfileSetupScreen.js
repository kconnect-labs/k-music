import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/auth/InputField';
import Button from '../../components/auth/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import { AUTH_STRINGS } from '../../constants/strings';

const ProfileSetupScreen = () => {
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [about, setAbout] = useState('');
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const { setupProfile, loading } = useAuth();

  const validate = () => {
    const newErrors = {};
    
    if (!name) {
      newErrors.name = AUTH_STRINGS.NAME_REQUIRED;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePick = async () => {
    // Запрос разрешения на доступ к галерее
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        AUTH_STRINGS.PERMISSION_DENIED, 
        AUTH_STRINGS.PERMISSION_DENIED_MESSAGE
      );
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0]);
      }
    } catch (error) {
      console.log('Ошибка выбора изображения:', error);
      Alert.alert(AUTH_STRINGS.ERROR, AUTH_STRINGS.PICKUP_IMAGE_ERROR);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
    try {
      const profileData = {
        name,
        interests,
        about,
        photo,
        agree_terms: true,  // Требуется API
        agree_privacy: true, // Требуется API
      };
      
      await setupProfile(profileData);
      
      Alert.alert(
        AUTH_STRINGS.PROFILE_SETUP_SUCCESSFUL,
        AUTH_STRINGS.PROFILE_SETUP_SUCCESSFUL_MESSAGE
      );
    } catch (err) {
      Alert.alert(
        AUTH_STRINGS.PROFILE_SETUP_FAILED,
        err.message || AUTH_STRINGS.PROFILE_SETUP_FAILED_MESSAGE
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{AUTH_STRINGS.COMPLETE_PROFILE}</Text>
          <Text style={styles.subtitle}>{AUTH_STRINGS.PROFILE_SUBTITLE}</Text>
          
          <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick}>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.avatar} />
            ) : (
              <View style={styles.placeholderAvatar}>
                <Text style={styles.placeholderText}>{AUTH_STRINGS.ADD_PHOTO}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.formContainer}>
            <InputField
              label={AUTH_STRINGS.DISPLAY_NAME}
              value={name}
              onChangeText={setName}
              placeholder={AUTH_STRINGS.ENTER_NAME}
              error={errors.name}
            />
            
            <InputField
              label={AUTH_STRINGS.INTERESTS}
              value={interests}
              onChangeText={setInterests}
              placeholder={AUTH_STRINGS.ENTER_INTERESTS}
            />
            
            <InputField
              label={AUTH_STRINGS.ABOUT_ME}
              value={about}
              onChangeText={setAbout}
              placeholder={AUTH_STRINGS.ENTER_ABOUT}
              multiline
              numberOfLines={4}
            />
            
            <Button
              title={AUTH_STRINGS.COMPLETE_SETUP}
              onPress={handleSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: SIZES.PADDING,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.XXX_LARGE,
    fontWeight: FONTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginTop: SIZES.XXX_LARGE,
    marginBottom: SIZES.BASE,
  },
  subtitle: {
    fontSize: FONTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SIZES.XXX_LARGE,
  },
  avatarContainer: {
    marginBottom: SIZES.XXX_LARGE,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY,
  },
  placeholderAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.PRIMARY,
    fontSize: FONTS.REGULAR,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
  },
  submitButton: {
    marginTop: SIZES.XXX_LARGE,
  },
});

export default ProfileSetupScreen; 