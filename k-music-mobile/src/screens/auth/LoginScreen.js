import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/auth/InputField';
import Button from '../../components/auth/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import { AUTH_STRINGS } from '../../constants/strings';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { login, loading, error } = useAuth();

  const validate = () => {
    const newErrors = {};
    
    if (!usernameOrEmail) {
      newErrors.usernameOrEmail = AUTH_STRINGS.USERNAME_REQUIRED;
    }
    
    if (!password) {
      newErrors.password = AUTH_STRINGS.PASSWORD_REQUIRED;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    try {
      const response = await login(usernameOrEmail, password);
      
      if (response && response.needsProfileSetup) {
        navigation.navigate('ProfileSetup');
      }
    } catch (err) {
      Alert.alert(
        AUTH_STRINGS.LOGIN_FAILED,
        err.message || AUTH_STRINGS.LOGIN_FAILED_MESSAGE
      );
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={[COLORS.BACKGROUND, COLORS.CARD_BACKGROUND]}
            style={styles.gradient}
          >
            <View style={styles.headerContainer}>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../../assets/Logo.svg')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Коннект Музыка</Text>
              <Text style={styles.subtitle}>{AUTH_STRINGS.LOGIN_SUBTITLE}</Text>
            </View>
            
            <View style={styles.formCard}>
              {error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color={COLORS.ERROR} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              
              <View style={styles.formContainer}>
                <InputField
                  label={AUTH_STRINGS.USERNAME_OR_EMAIL}
                  value={usernameOrEmail}
                  onChangeText={setUsernameOrEmail}
                  placeholder={AUTH_STRINGS.ENTER_USERNAME_OR_EMAIL}
                  error={errors.usernameOrEmail}
                  icon="person-outline"
                />
                
                <InputField
                  label={AUTH_STRINGS.PASSWORD}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={AUTH_STRINGS.ENTER_PASSWORD}
                  secureTextEntry={!passwordVisible}
                  error={errors.password}
                  icon="lock-closed-outline"
                  rightIcon={
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                      <Ionicons 
                        name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} 
                        size={20} 
                        color={COLORS.TEXT_SECONDARY} 
                      />
                    </TouchableOpacity>
                  }
                />
                
                <Button
                  title={AUTH_STRINGS.LOGIN}
                  onPress={handleLogin}
                  loading={loading}
                  style={styles.loginButton}
                />
                
                <View style={styles.registerContainer}>
                  <Text style={styles.registerText}>{AUTH_STRINGS.DONT_HAVE_ACCOUNT}</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>{AUTH_STRINGS.CREATE_ACCOUNT}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SIZES.PADDING,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: height * 0.05,
    paddingBottom: height * 0.03,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: SIZES.LARGE,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: FONTS.XXX_LARGE,
    fontWeight: FONTS.BOLD,
    color: COLORS.PRIMARY,
    marginBottom: SIZES.BASE,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.MEDIUM,
    color: COLORS.TEXT_SECONDARY,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: SIZES.PADDING,
    marginTop: SIZES.LARGE,
    marginBottom: height * 0.05,
    elevation: 3,
    shadowColor: COLORS.PRIMARY_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.ERROR + '20', // 20% opacity
    padding: SIZES.SMALL,
    borderRadius: 8,
    marginBottom: SIZES.MEDIUM,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONTS.SMALL,
    marginLeft: 8,
    flex: 1,
  },
  formContainer: {
    width: '100%',
  },
  loginButton: {
    marginTop: SIZES.LARGE,
    height: 50,
    borderRadius: 25,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.LARGE,
    paddingVertical: SIZES.SMALL,
  },
  registerText: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: FONTS.SMALL,
    marginRight: 5,
  },
  registerLink: {
    color: COLORS.PRIMARY,
    fontSize: FONTS.SMALL,
    fontWeight: FONTS.BOLD,
  },
});

export default LoginScreen; 