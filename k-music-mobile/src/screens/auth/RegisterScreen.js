import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/auth/InputField';
import Button from '../../components/auth/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import { AUTH_STRINGS } from '../../constants/strings';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();

  const validate = () => {
    const newErrors = {};
    
    if (!username) {
      newErrors.username = AUTH_STRINGS.USERNAME_REQUIRED;
    } else if (username.length < 3) {
      newErrors.username = AUTH_STRINGS.USERNAME_TOO_SHORT;
    }
    
    if (!email) {
      newErrors.email = AUTH_STRINGS.EMAIL_REQUIRED;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = AUTH_STRINGS.INVALID_EMAIL;
    }
    
    if (!password) {
      newErrors.password = AUTH_STRINGS.PASSWORD_REQUIRED;
    } else if (password.length < 6) {
      newErrors.password = AUTH_STRINGS.PASSWORD_TOO_SHORT;
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = AUTH_STRINGS.PASSWORDS_DO_NOT_MATCH;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    try {
      const response = await register(username, email, password);
      
      if (response.success) {
        Alert.alert(
          AUTH_STRINGS.REGISTRATION_SUCCESSFUL,
          AUTH_STRINGS.REGISTRATION_SUCCESSFUL_MESSAGE,
          [
            { 
              text: AUTH_STRINGS.OK, 
              onPress: () => navigation.navigate('Login') 
            }
          ]
        );
      }
    } catch (err) {
      Alert.alert(
        AUTH_STRINGS.REGISTRATION_FAILED,
        err.message || AUTH_STRINGS.REGISTRATION_FAILED_MESSAGE
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/Logo.svg')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>К-Музыка</Text>
          </View>
          
          <Text style={styles.title}>{AUTH_STRINGS.CREATE_ACCOUNT}</Text>
          <Text style={styles.subtitle}>{AUTH_STRINGS.SIGNUP_SUBTITLE}</Text>
          
          <View style={styles.formContainer}>
            <InputField
              label={AUTH_STRINGS.USERNAME}
              value={username}
              onChangeText={setUsername}
              placeholder={AUTH_STRINGS.CHOOSE_USERNAME}
              error={errors.username}
            />
            
            <InputField
              label={AUTH_STRINGS.EMAIL}
              value={email}
              onChangeText={setEmail}
              placeholder={AUTH_STRINGS.ENTER_EMAIL}
              keyboardType="email-address"
              error={errors.email}
            />
            
            <InputField
              label={AUTH_STRINGS.PASSWORD}
              value={password}
              onChangeText={setPassword}
              placeholder={AUTH_STRINGS.CREATE_PASSWORD}
              secureTextEntry
              error={errors.password}
            />
            
            <InputField
              label={AUTH_STRINGS.CONFIRM_PASSWORD}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={AUTH_STRINGS.CONFIRM_YOUR_PASSWORD}
              secureTextEntry
              error={errors.confirmPassword}
            />
            
            <Button
              title={AUTH_STRINGS.REGISTER}
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>{AUTH_STRINGS.ALREADY_HAVE_ACCOUNT}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>{AUTH_STRINGS.LOGIN}</Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.X_LARGE,
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoText: {
    fontSize: FONTS.XX_LARGE,
    fontWeight: FONTS.BOLD,
    color: COLORS.PRIMARY,
    marginTop: SIZES.BASE,
  },
  title: {
    fontSize: FONTS.XXX_LARGE,
    fontWeight: FONTS.BOLD,
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SIZES.BASE,
  },
  subtitle: {
    fontSize: FONTS.REGULAR,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SIZES.XXX_LARGE,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
  },
  registerButton: {
    marginTop: SIZES.LARGE,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.LARGE,
  },
  loginText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONTS.REGULAR,
    marginRight: 5,
  },
  loginLink: {
    color: COLORS.PRIMARY,
    fontSize: FONTS.REGULAR,
    fontWeight: FONTS.BOLD,
  },
});

export default RegisterScreen; 