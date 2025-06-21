// src/screens/auth/CadastroScreen.tsx
import React, { useState } from 'react';
import { 
  Text, 
  SafeAreaView, 
  Alert, 
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { globalStyles, COLORS, FONT_FAMILY } from '../../styles/globalStyles';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { post } from '../../services/api';
import { CadastroScreenProps } from '../../navigation/types';
import { useAuth, User } from '../../context/AuthContext';

const CadastroScreen = ({ navigation }: CadastroScreenProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Pega a função de login do contexto

  const handleRegister = async () => {
    if (!nome || !email || !cpf || !senha) {
      Alert.alert('Erro de Validação', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      // Chama a API de registro. Se falhar, o serviço de API mostrará um erro.
      await post('/register', { nome, email, cpf, senha });
      
      // ---- LÓGICA DE AUTO-LOGIN IMPLEMENTADA ----
      // Se a chamada acima foi bem-sucedida, criamos um objeto de usuário local
      // e chamamos a função de login para entrar diretamente no app.
      
      const newUser: User = {
        id: cpf, // Usando CPF como um ID único temporário
        nome: nome,
        email: email,
      };

      // Loga o usuário no app, o que o redirecionará para a tela principal.
      await login(newUser);

    } catch (error) {
      // O erro já foi exibido em um Alert pelo nosso serviço de API.
      console.error('Falha no cadastro:', error);
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
          <Text style={globalStyles.title}>Crie sua conta</Text>
          <Text style={globalStyles.subtitle}>Preencha os dados para começar.</Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInput
            placeholder="Seu nome completo"
            value={nome}
            onChangeText={setNome}
            editable={!isLoading}
            variant="dark"
          />
          <CustomInput
            placeholder="Seu CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            editable={!isLoading}
            variant="dark"
          />
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
            placeholder="Crie uma senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!isLoading}
            variant="dark"
          />
          
          {isLoading ? (
            <ActivityIndicator size="large" color={COLORS.white} style={{ height: 55 }}/>
          ) : (
            <CustomButton title="Cadastrar" variant="primary" onPress={handleRegister} />
          )}

          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <Text style={[styles.loginText, styles.loginLink]}>Entre</Text>
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
  loginButton: {
    marginTop: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: COLORS.lightText,
    fontFamily: FONT_FAMILY.Regular,
    fontSize: 14,
  },
  loginLink: {
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.white,
  },
});

export default CadastroScreen;
