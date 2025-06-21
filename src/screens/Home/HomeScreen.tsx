import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  SafeAreaView, 
  Image, 
  Alert, 
  Platform,
  PermissionsAndroid,
  ToastAndroid
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { HomeScreenProps } from '../../navigation/types';
import { COLORS, FONT_FAMILY } from '../../styles/globalStyles';
import { getHtml, post } from '../../services/api';
import { uploadImageWithFallback } from '../../services/imageUploadService';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { user } = useAuth();
  const [mapHtml, setMapHtml] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processMapHtml = async () => {
      setIsLoadingMap(true);
      try {
        const rawHtml = await getHtml('/genarete-map');
        const srcdocMatch = rawHtml.match(/srcdoc="([^"]*)"/);
        if (!srcdocMatch || !srcdocMatch[1]) {
          throw new Error('A estrutura do HTML da API mudou. Conteúdo "srcdoc" não encontrado.');
        }

        let cleanHtml = srcdocMatch[1]
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"');

        const styleInject = `<style>html, body, .leaflet-container, #map_1af4643b221f00b8fc9c4226e25b4ceb { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; }</style>`;
        cleanHtml = cleanHtml.replace('</head>', `${styleInject}</head>`);
       
        setMapHtml(cleanHtml);
      } catch (e: any) {
        setError(e.message || 'Ocorreu um erro ao processar o mapa.');
      } finally {
        setIsLoadingMap(false);
      }
    };

    processMapHtml();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // Solicitar permissões em paralelo
        const [cameraGranted, locationGranted] = await Promise.all([
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: 'Permissão de Câmera',
            message: 'O app precisa acessar sua câmera para tirar fotos.',
            buttonPositive: 'Permitir',
          }),
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            title: 'Permissão de Localização',
            message: 'O app precisa acessar sua localização para registrar onde os problemas foram reportados.',
            buttonPositive: 'Permitir',
          }),
        ]);

        if (
          cameraGranted !== PermissionsAndroid.RESULTS.GRANTED ||
          locationGranted !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          ToastAndroid.show('Permissões necessárias não concedidas', ToastAndroid.LONG);
          return false;
        }
        return true;
      } catch (err) {
        console.warn('Erro ao solicitar permissões:', err);
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      setIsUploading(true);

      // Primeiro obter a localização
      const position = await new Promise<Geolocation.GeoPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          resolve,
          (error) => {
            console.error('Erro na localização:', error);
            reject(new Error('Não foi possível obter a localização'));
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });

      // Depois abrir a câmera
      const cameraResponse = await new Promise<any>((resolve) => {
        launchCamera({
          mediaType: 'photo',
          quality: 0.7,
          saveToPhotos: true,
          cameraType: 'back',
        }, resolve);
      });

      if (cameraResponse.didCancel) {
        ToastAndroid.show('Captura cancelada', ToastAndroid.SHORT);
        return;
      }

      if (cameraResponse.errorCode || !cameraResponse.assets?.[0]) {
        throw new Error(cameraResponse.errorMessage || 'Erro ao capturar imagem');
      }

      const imageAsset = cameraResponse.assets[0];
      const imageUrl = await uploadImageWithFallback(imageAsset);

      await post('/send-photo', {
        user_app_id: user?.id,
        image_url: imageUrl,
        timestamp: new Date().toISOString(),
        lat: position.coords.latitude,
        long: position.coords.longitude,
      });

      // Navegar para a tela de sucesso após um pequeno delay
      setTimeout(() => {
        navigation.navigate('Success', {
          title: 'Sucesso!',
          message: 'Foto enviada com sucesso.',
        });
      }, 500);

    } catch (error: any) {
      console.error('Erro no processo:', error);
      ToastAndroid.show(error.message || 'Erro ao processar foto', ToastAndroid.LONG);
    } finally {
      setIsUploading(false);
    }
  };

  const renderMapContent = () => {
    if (isLoadingMap) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.infoText}>Carregando mapa...</Text>
        </View>
      );
    }
    if (error || !mapHtml) {
      return (
        <View style={styles.centered}>
          <Icon name="alert-circle-outline" size={60} color={COLORS.danger} />
          <Text style={styles.errorText}>{error || 'Não foi possível renderizar o mapa.'}</Text>
        </View>
      );
    }
    return <WebView source={{ html: mapHtml }} style={styles.webview} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderMapContent()}
     
      <TouchableOpacity 
        style={styles.cameraButton} 
        onPress={handleTakePhoto} 
        disabled={isUploading}
      >
        <Image source={require('../../assets/images/Camera.png')} style={styles.logo} />
        <Text style={styles.buttonText}>Reportar</Text>
      </TouchableOpacity>

      {isUploading && (
        <View style={styles.uploadOverlay}>
          <ActivityIndicator size="large" color={COLORS.white} />
          <Text style={styles.uploadText}>Enviando e processando...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 35,
    height: 35,
  },
  webview: {
    flex: 1,
    width: '100%',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 40,
    width: "90%",
    height: 60,
    alignSelf: 'center',
    borderRadius: 13,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: "5%",
    paddingRight: "34%",
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: FONT_FAMILY.Medium,
    color: 'black'
  },
  buttonText: {
    fontSize: 18,
    fontFamily: FONT_FAMILY.Bold,
    color: 'black'
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: FONT_FAMILY.Bold,
    color: COLORS.danger,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: FONT_FAMILY.Medium,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default HomeScreen;