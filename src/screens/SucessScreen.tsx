// src/screens/SuccessScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SuccessScreenProps } from '../navigation/types';
import { globalStyles, COLORS } from '../styles/globalStyles';
import CustomButton from '../components/CustomButton';

const SuccessScreen = ({ route, navigation }: SuccessScreenProps) => {
  const { title, message } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Icon name="checkmark-circle" size={80} color={COLORS.success} />
        <Text style={globalStyles.title}>{title}</Text>
        <Text style={globalStyles.subtitle}>{message}</Text>
        <CustomButton
          title="Fechar"
          onPress={() => navigation.goBack()}
          buttonStyle={{ backgroundColor: COLORS.success }}
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

export default SuccessScreen;
