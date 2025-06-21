// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';

import { AuthStack } from './AuthStack';
import { MainTab } from './MainTab';
import SuccessScreen from '../screens/SucessScreen';
import ErrorScreen from '../screens/ErrorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  // ---- LÓGICA CORRIGIDA ----
  // Pegamos o objeto 'user' diretamente do contexto.
  // A existência ou não de 'user' (se ele é um objeto ou null)
  // é o que decide se o usuário está logado.
  const { user } = useAuth();
  
  console.log('[AppNavigator] Renderizando. Objeto de usuário:', user);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Se o objeto 'user' EXISTE, o usuário está logado.
        <Stack.Screen name="Main" component={MainTab} />
      ) : (
        // Se o objeto 'user' é NULL, o usuário não está logado.
        <Stack.Screen name="Auth" component={AuthStack} />
      )}

      {/* Telas Modais que aparecem sobre toda a aplicação */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Error" component={ErrorScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};
