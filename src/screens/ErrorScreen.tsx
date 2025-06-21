// src/screens/ErrorScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ErrorScreenProps } from '../navigation/types';
import { globalStyles, COLORS } from '../styles/globalStyles';
import CustomButton from '../components/CustomButton';

const ErrorScreen = ({ route, navigation }: ErrorScreenProps) => {
  const { title, message } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="close-circle" size={80} color={COLORS.danger} />
        <Text style={globalStyles.title}>{title}</Text>
        <Text style={globalStyles.subtitle}>{message}</Text>
        <CustomButton
          title="Tentar Novamente"
          onPress={() => navigation.goBack()}
          buttonStyle={{ backgroundColor: COLORS.danger }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  }
});

export default ErrorScreen;
