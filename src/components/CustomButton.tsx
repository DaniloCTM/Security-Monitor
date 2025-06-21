// src/components/CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { COLORS, FONT_FAMILY } from '../styles/globalStyles';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline'; // Agora temos uma variante 'outline'
  buttonStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const CustomButton = ({ title, variant = 'primary', buttonStyle, textStyle, ...props }: CustomButtonProps) => {
  // Define os estilos com base na variante
  const isPrimary = variant === 'primary';
  const containerStyle = isPrimary ? styles.primaryContainer : styles.outlineContainer;
  const contentStyle = isPrimary ? styles.primaryText : styles.outlineText;

  return (
    <TouchableOpacity
      style={[styles.button, containerStyle, buttonStyle]}
      activeOpacity={0.8}
      {...props}>
      <Text style={[styles.text, contentStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12, // Raio da borda
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.Bold,
  },
  // Estilos para o botão primário (Entrar)
  primaryContainer: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  primaryText: {
    color: COLORS.white,
  },
  // Estilos para o botão contornado (Cadastrar)
  outlineContainer: {
    backgroundColor: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
});

export default CustomButton;
