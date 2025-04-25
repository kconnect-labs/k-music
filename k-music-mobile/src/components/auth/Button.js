import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import { LinearGradient } from 'expo-linear-gradient';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  disabled = false,
  variant = 'filled', // 'filled', 'outlined', 'text', 'gradient'
  icon,
  iconPosition = 'left', // 'left', 'right'
}) => {
  const getButtonStyle = () => {
    if (variant === 'outlined') {
      return [styles.button, styles.outlinedButton, style];
    } else if (variant === 'text') {
      return [styles.button, styles.textButton, style];
    } else if (variant === 'gradient') {
      return [styles.button, style];
    }
    return [styles.button, styles.filledButton, style];
  };

  const getTextStyle = () => {
    if (variant === 'outlined') {
      return [styles.buttonText, styles.outlinedButtonText, textStyle];
    } else if (variant === 'text') {
      return [styles.buttonText, styles.textButtonText, textStyle];
    } else if (variant === 'gradient') {
      return [styles.buttonText, styles.filledButtonText, textStyle];
    }
    return [styles.buttonText, styles.filledButtonText, textStyle];
  };

  const renderButtonContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'filled' || variant === 'gradient' ? COLORS.TEXT_PRIMARY : COLORS.PRIMARY} 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </>
  );

  // Если это кнопка с градиентом
  if (variant === 'gradient' && !disabled && !loading) {
    return (
      <TouchableOpacity
        style={[styles.buttonContainer, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.PRIMARY_LIGHT, COLORS.PRIMARY, COLORS.PRIMARY_DARK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.button, (disabled || loading) && styles.disabledButton]}
        >
          {renderButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Если это обычная кнопка
  return (
    <TouchableOpacity
      style={[getButtonStyle(), (disabled || loading) && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    overflow: 'hidden',
    borderRadius: SIZES.RADIUS,
  },
  button: {
    height: 50,
    borderRadius: SIZES.RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.PADDING * 1.25,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: FONTS.REGULAR,
    fontWeight: FONTS.BOLD,
    textAlign: 'center',
  },
  filledButtonText: {
    color: COLORS.BACKGROUND,
  },
  outlinedButtonText: {
    color: COLORS.PRIMARY,
  },
  textButtonText: {
    color: COLORS.PRIMARY,
  },
  disabledButton: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button; 