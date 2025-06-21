// App.tsx (VERSÃO CORRETA E COMPLETA)
import 'react-native-gesture-handler'; // Importante: deve ser a primeira linha
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    // 1. O AuthProvider deve envolver a navegação.
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />
        {/* 2. O AppNavigator agora está dentro do AuthProvider
               e terá acesso ao contexto. */}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
