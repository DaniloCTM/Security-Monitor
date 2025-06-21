// src/navigation/MainTab.tsx
import React from 'react';
import { Image, StyleSheet } from 'react-native'; // Importa o componente Image
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons'; // Não precisamos mais desta linha
import { MainTabParamList } from './types';
import { COLORS } from '../styles/globalStyles';

import HomeScreen from '../screens/Home/HomeScreen';
import HistoricoScreen from '../screens/Historico/HistoricoScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTab = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'Home', 
        
        // --- LÓGICA DO ÍCONE ATUALIZADA ---
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Home') {
            // Usa require para carregar a imagem da sua pasta de assets
            // Assumi que as imagens estão em `src/assets/images/` e são .png
            iconSource = require('../assets/images/CameraNavBar.png'); 
          } else if (route.name === 'Historico') {
            iconSource = require('../assets/images/History.png');
          }

          return (
            <Image
              source={iconSource}
              resizeMode="contain"
              style={[
                styles.icon,
                // Aplica a cor (tintColor) com base no estado 'focused'
                // Isso colore a parte não-transparente da sua imagem PNG
                { tintColor: color }
              ]}
            />
          );
        },
        // --- ESTILOS ATUALIZADOS CONFORME SOLICITADO ---
        tabBarActiveTintColor: '#FFD700', // Amarelo para o ícone e texto ativos
        tabBarInactiveTintColor: COLORS.white, // Branco para o ícone e texto inativos
        tabBarLabelStyle: { 
          fontSize: 12, 
          fontFamily: 'Poppins-Medium',
          marginBottom: 5, // Ajuste para o espaçamento do texto
        },
        tabBarStyle: {
            backgroundColor: COLORS.primary, // Fundo da tab bar com a cor primária
            height: 100, // Aumenta um pouco a altura para acomodar melhor
            paddingTop: 15,
            borderTopWidth: 0, // Remove a linha de borda superior
            elevation: 0, // Remove a sombra no Android
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Mapa' }} />
      <Tab.Screen name="Historico" component={HistoricoScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
    icon: {
        width: 28, // Aumenta um pouco o tamanho do ícone
        height: 28,
    }
})
