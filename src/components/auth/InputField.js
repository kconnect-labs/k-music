import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline = false,
  numberOfLines = 1,
  icon,
  rightIcon,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer, 
        error && styles.inputContainerError,
        multiline && styles.multilineInputContainer
      ]}>
        {icon && (
          <View style={styles.iconContainer}>
            {typeof icon === 'string' ? (
              <Ionicons name={icon} size={20} color={COLORS.TEXT_SECONDARY} />
            ) : (
              icon
            )}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
        
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: SIZES.MEDIUM,
  },
  label: {
    fontSize: FONTS.MEDIUM,
    color: COLORS.PRIMARY,
    marginBottom: 6,
    fontWeight: FONTS.MEDIUM,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderRadius: SIZES.RADIUS,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  multilineInputContainer: {
    height: 100,
  },
  inputContainerError: {
    borderColor: COLORS.ERROR,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: FONTS.REGULAR,
    color: COLORS.TEXT_PRIMARY,
    paddingHorizontal: SIZES.PADDING,
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  iconContainer: {
    paddingLeft: SIZES.MEDIUM,
  },
  rightIconContainer: {
    paddingRight: SIZES.MEDIUM,
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: FONTS.SMALL,
    marginTop: 4,
  },
});

export default InputField; 