// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#073F5A', // Azul escuro
  white: '#FFFFFF',
  lightText: '#F0F0F0', // Texto claro para fundos escuros
  darkText: '#1c1c1c', // Texto escuro para fundos claros
  secondary: '#88a6b1', // Um tom de azul acinzentado para detalhes
  success: '#28a745',
  danger: '#dc3545',
};

// Nomes de fontes para consistência. Correspondem aos nomes dos arquivos .ttf.
export const FONT_FAMILY = {
  Regular: 'Poppins-Regular',
  Medium: 'Poppins-Medium',
  Bold: 'Poppins-Bold',
};

export const globalStyles = StyleSheet.create({
  // Container padrão para todas as telas, com fundo escuro
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  // Título principal, agora claro para contrastar com o fundo
  title: {
    fontSize: 32,
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.white,
    marginBottom: 10,
    textAlign: 'center',
  },
  // Subtítulo, também claro
  subtitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.Regular,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
});
