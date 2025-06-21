// src/components/CustomInput.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, FONT_FAMILY } from '../styles/globalStyles';

interface CustomInputProps extends TextInputProps {
  variant?: 'light' | 'dark';
}

const CustomInput = ({ variant = 'light', ...props }: CustomInputProps) => {
  const isDark = variant === 'dark';
  const inputStyle = isDark ? styles.darkInput : styles.lightInput;
  const placeholderColor = isDark ? COLORS.secondary : '#888';

  return (
    <TextInput
      style={[styles.input, inputStyle]}
      placeholderTextColor={placeholderColor}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 55,
    width: '100%',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: FONT_FAMILY.Regular,
    marginBottom: 15,
    borderWidth: 2,
  },
  lightInput: {
    backgroundColor: COLORS.lightGray,
    borderColor: '#ddd',
    color: COLORS.darkText,
  },
  darkInput: {
    backgroundColor: 'rgba(255, 255, 255, 0)', // Um fundo translúcido
    borderColor: COLORS.secondary,
    color: COLORS.white,
  },
});

export default CustomInput;
