// src/screens/auth/PresentationScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import CustomButton from '../../components/CustomButton';
import { PresentationScreenProps } from '../../navigation/types';

const PresentationScreen = ({ navigation }: PresentationScreenProps) => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={styles.content}>
        {/* Adicionando a Logo */}
        <Image
          source={require('../../assets/images/Logo.jpeg')} // Caminho relativo da logo
          style={styles.logo}
        />

        <Text style={globalStyles.title}>Security Monitor</Text>
        <Text style={globalStyles.subtitle}>
          Atuamos na identificação rápida de riscos e desordens para prevenir crimes e desastres. Sua foto previne o crime e protege o seu caminho.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Entrar"
          variant="primary" // Usando a nova variante
          onPress={() => navigation.navigate('Login')}
        />
        <View style={{ height: 15 }} />
        <CustomButton
          title="Cadastrar"
          variant="outline" // Usando a nova variante
          onPress={() => navigation.navigate('Cadastro')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75, // Deixa a logo redonda se ela for quadrada
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 170, // Garante um espaçamento na parte inferior
  },
});

export default PresentationScreen;
