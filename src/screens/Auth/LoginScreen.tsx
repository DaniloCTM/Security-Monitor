// src/screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { 
  Text, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator, 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { globalStyles, COLORS, FONT_FAMILY } from '../../styles/globalStyles';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth, User } from '../../context/AuthContext';
import { post } from '../../services/api';
import { LoginScreenProps } from '../../navigation/types';

interface LoginResponse {
  message: string;
  user?: User;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      await post('/login', { email, senha });

      const loggedInUser: User = {
        id: email,
        nome: "Usuário Logado", // Temporário até a API retornar o nome
        email: email,
      };
      
      await login(loggedInUser);
      
    } catch (error) {
      console.error('Falha no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/Logo.jpeg')}
            style={styles.logo}
          />
          <Text style={globalStyles.title}>Bem-vindo de volta!</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            placeholder="Seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
            variant="dark"
          />
          <CustomInput
            placeholder="Sua senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!isLoading}
            variant="dark"
          />
          
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.white} style={{ height: 55 }}/>
          ) : (
            <CustomButton title="Acessar" variant="primary" onPress={handleLogin} />
          )}

          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Cadastro')}>
            <Text style={styles.registerText}>Não tem uma conta? </Text>
            <Text style={[styles.registerText, styles.registerLink]}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 30,
  },
  formContainer: {
    paddingBottom: 20,
  },
  registerButton: {
    marginTop: 160,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: COLORS.lightText,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 14,
  },
  registerLink: {
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.white,
  },
});

export default LoginScreen;
