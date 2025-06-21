// src/screens/historico/HistoricoScreen.tsx
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { globalStyles, COLORS, FONT_FAMILY } from '../../styles/globalStyles';
import { HistoricoScreenProps } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { get, post } from '../../services/api'; // Vamos usar POST para enviar o ID do usuário

// Define o tipo de um item do histórico, baseado na sua API
interface HistoryItemData {
  id: number; // ou string, dependendo do seu banco
  image_url: string;
  timestamp: string;
  lat: number;
  long: number;
  // Adicione outros campos que sua API retornar, como o resultado da análise
  // analysis_result?: any; 
}

// Componente para renderizar cada item da lista
const HistoryItem = ({ item }: { item: HistoryItemData }) => {
  // Formata a data para uma leitura mais amigável
  const formattedDate = new Date(item.timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.locationText}>Lat: {item.lat.toFixed(4)}, Long: {item.long.toFixed(4)}</Text>
      </View>
    </View>
  );
};


const HistoricoScreen = ({ navigation }: HistoricoScreenProps) => {
  const { user, logout } = useAuth();
  const [history, setHistory] = useState<HistoryItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    // Garante que temos um usuário e um ID para fazer a requisição
    if (!user || !user.id) {
      setError("Informações do usuário não encontradas. Por favor, faça login novamente.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log(`[History] Buscando histórico para o usuário ID: ${user.id}`);
      
      // --- LÓGICA CORRIGIDA ---
      // 1. Usamos a rota correta: /user_photos
      // 2. Usamos POST para enviar o user_app_id no corpo da requisição
      const data = await get<HistoryItemData[]>(`/user_photos?user_app_id=${user.id}`);
      
      // A API retorna um objeto com uma chave 'photos', vamos extraí-la
      // Se sua API retornar o array diretamente, remova o `.photos`
      setHistory((data as any).photos || []);
      
    } catch (e: any) {
      console.error("[History] Erro ao buscar histórico:", e);
      setError(e.message || "Não foi possível carregar o histórico.");
      setHistory([]); // Limpa o histórico em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  // Executa a busca de dados toda vez que a tela recebe o foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchHistory();
    });
    return unsubscribe;
  }, [navigation, user]); // Adicionado `user` como dependência

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => <Text style={styles.headerTitle}>{user?.nome || 'Usuário'}</Text>,
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color={COLORS.primary} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: COLORS.white },
      headerShadowVisible: false,
      headerElevation: 0,
    });
  }, [navigation, logout, user]);

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;
    }
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    return (
      <FlatList
        data={history}
        renderItem={({ item }) => <HistoryItem item={item} />}
        keyExtractor={item => String(item.id)}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum envio encontrado para este usuário.</Text>}
        contentContainerStyle={{ paddingTop: 10 }}
        onRefresh={fetchHistory} // Permite "puxar para atualizar"
        refreshing={isLoading}
      />
    );
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 15,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
    backgroundColor: COLORS.lightGray,
  },
  infoContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.darkGray,
  },
  locationText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.Regular,
    color: COLORS.secondary,
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY.Medium,
    color: COLORS.primary,
    marginLeft: 5,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    color: COLORS.danger,
    fontSize: 16,
    paddingHorizontal: 20
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: COLORS.secondary,
    fontSize: 16,
  },
});

export default HistoricoScreen;
