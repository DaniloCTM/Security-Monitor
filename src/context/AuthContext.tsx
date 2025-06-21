// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View, Alert } from 'react-native';
import { get } from '../services/api'; // Importamos a função GET

export interface User {
  id: string; 
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const userJson = await AsyncStorage.getItem('@Auth:user');
        
        if (userJson) {
          // --- LÓGICA DE HEALTH CHECK ADICIONADA ---
          console.log('[AuthContext] Usuário encontrado localmente. Verificando conexão com a API...');
          try {
            // 1. Tenta fazer uma chamada leve para a raiz da API.
            await get('/'); 
            
            // 2. Se a chamada for bem-sucedida, o servidor está online. Definimos o usuário.
            console.log('[AuthContext] API online. Restaurando sessão.');
            setUser(JSON.parse(userJson));

          } catch (apiError) {
            // 3. Se a chamada falhar, o servidor está offline. Deslogamos o usuário.
            console.log('[AuthContext] API offline. Invalidando sessão local.');
            await AsyncStorage.removeItem('@Auth:user'); // Limpa o dado inválido
            // O Alert de erro de rede já é mostrado pelo nosso serviço 'get'.
          }
        }
      } catch (e) {
        console.error("Falha ao carregar dados do AsyncStorage", e);
      } finally {
        // Independentemente do resultado, paramos o loading inicial.
        setIsLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (userData: User) => {
    await AsyncStorage.setItem('@Auth:user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@Auth:user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
