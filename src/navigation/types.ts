// src/navigation/types.ts

import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Parâmetros que cada tela pode receber. `undefined` significa sem parâmetros.
export type AuthStackParamList = {
  Presentation: undefined;
  Login: undefined;
  Cadastro: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Historico: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Success: { title: string; message: string };
  Error: { title:string; message: string };
};

// Tipos das props para cada tela individualmente.
// Isso dá autocomplete e segurança para `navigation` e `route`.

// Telas do Fluxo de Autenticação
export type PresentationScreenProps = NativeStackScreenProps<AuthStackParamList, 'Presentation'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type CadastroScreenProps = NativeStackScreenProps<AuthStackParamList, 'Cadastro'>;

// Telas do Fluxo Principal (com Abas)
// Usamos CompositeScreenProps para que as telas das abas também possam navegar para as telas modais (Success/Error)
export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type HistoricoScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Historico'>,
  NativeStackScreenProps<RootStackParamList>
>;

// Telas Modais de Resultado
export type SuccessScreenProps = NativeStackScreenProps<RootStackParamList, 'Success'>;
export type ErrorScreenProps = NativeStackScreenProps<RootStackParamList, 'Error'>;
