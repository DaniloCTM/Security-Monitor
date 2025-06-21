// src/services/imageUploadService.ts
import { Asset } from 'react-native-image-picker';

// Configurações das APIs - substitua pelas suas chaves reais
const IMGUR_CLIENT_ID = '4f08dd50d367851';
const IMGBB_API_KEY = '7ca4d80579891888670854b8c4c12dde';

// Interface para o resultado do upload
interface UploadResult {
  success: boolean;
  url?: string;
  error?: any;
}

// Tenta fazer o upload para o Imgur
const tryImgurUpload = async (imageAsset: Asset): Promise<UploadResult> => {
  try {
    console.log('[Upload] Tentando Imgur...');
    console.log('[Upload] Dados da imagem:', {
      uri: imageAsset.uri,
      type: imageAsset.type,
      fileName: imageAsset.fileName,
      fileSize: imageAsset.fileSize
    });

    if (!IMGUR_CLIENT_ID) {
      console.error('[Upload] IMGUR_CLIENT_ID não configurado');
      return { success: false, error: 'Imgur Client ID não configurado' };
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageAsset.uri,
      type: imageAsset.type || 'image/jpeg',
      name: imageAsset.fileName || 'image.jpg',
    } as any);

    console.log('[Upload] Enviando para Imgur...');
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Accept': 'application/json',
      },
      body: formData,
    });

    console.log('[Upload] Resposta do Imgur:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const responseText = await response.text();
    console.log('[Upload] Texto da resposta Imgur:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[Upload] Erro ao parsear resposta do Imgur:', parseError);
      return { success: false, error: 'Resposta inválida do Imgur' };
    }

    console.log('[Upload] Dados parseados do Imgur:', data);
   
    if (data.success && data.data?.link) {
      console.log('[Upload] Sucesso no Imgur:', data.data.link);
      return { success: true, url: data.data.link };
    } else {
      console.error('[Upload] Falha no Imgur:', data);
      return { success: false, error: data.data?.error || 'Erro desconhecido no Imgur' };
    }
  } catch (error) {
    console.error('[Upload] Erro na requisição Imgur:', error);
    return { success: false, error };
  }
};

// Tenta fazer o upload para o ImgBB
const tryImgBBUpload = async (imageAsset: Asset): Promise<UploadResult> => {
  try {
    console.log('[Upload] Tentando ImgBB como fallback...');
    console.log('[Upload] Dados da imagem para ImgBB:', {
      uri: imageAsset.uri,
      type: imageAsset.type,
      fileName: imageAsset.fileName,
      fileSize: imageAsset.fileSize
    });

    if (!IMGBB_API_KEY) {
      console.error('[Upload] IMGBB_API_KEY não configurado');
      return { success: false, error: 'ImgBB API Key não configurado' };
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageAsset.uri,
      type: imageAsset.type || 'image/jpeg',
      name: imageAsset.fileName || 'image.jpg',
    } as any);

    console.log('[Upload] Enviando para ImgBB...');
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData,
    });

    console.log('[Upload] Resposta do ImgBB:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const responseText = await response.text();
    console.log('[Upload] Texto da resposta ImgBB:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[Upload] Erro ao parsear resposta do ImgBB:', parseError);
      return { success: false, error: 'Resposta inválida do ImgBB' };
    }

    console.log('[Upload] Dados parseados do ImgBB:', data);
   
    if (data.success && data.data?.url) {
      console.log('[Upload] Sucesso no ImgBB:', data.data.url);
      return { success: true, url: data.data.url };
    } else {
      console.error('[Upload] Falha no ImgBB:', data);
      return { success: false, error: data.error?.message || 'Erro desconhecido no ImgBB' };
    }
  } catch (error) {
    console.error('[Upload] Erro na requisição ImgBB:', error);
    return { success: false, error };
  }
};

// Função principal que orquestra o upload com fallback
export const uploadImageWithFallback = async (imageAsset: Asset): Promise<string> => {
  console.log('[Upload] Iniciando processo de upload com fallback...');
  
  // Validações iniciais
  if (!imageAsset.uri) {
    throw new Error('URI da imagem não encontrada');
  }

  console.log('[Upload] Validações iniciais OK, tentando Imgur primeiro...');
  const imgurResult = await tryImgurUpload(imageAsset);
  
  if (imgurResult.success && imgurResult.url) {
    console.log('[Upload] Sucesso com Imgur!', imgurResult.url);
    return imgurResult.url;
  }

  console.warn('[Upload] Falha no Imgur, tentando fallback para ImgBB...', imgurResult.error);
  const imgbbResult = await tryImgBBUpload(imageAsset);
 
  if (imgbbResult.success && imgbbResult.url) {
    console.log('[Upload] Sucesso com ImgBB!', imgbbResult.url);
    return imgbbResult.url;
  }

  console.error('[Upload] Falha em ambos os serviços.');
  console.error('[Upload] Erro Imgur:', imgurResult.error);
  console.error('[Upload] Erro ImgBB:', imgbbResult.error);
  
  // Criar mensagem de erro mais detalhada
  const errorDetails = [
    'Falha no upload da imagem:',
    `Imgur: ${imgurResult.error?.message || imgurResult.error}`,
    `ImgBB: ${imgbbResult.error?.message || imgbbResult.error}`
  ].join('\n');

  throw new Error(errorDetails);
};