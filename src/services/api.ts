// src/services/api.ts
import { Alert } from 'react-native';

const API_BASE_URL = 'https://public-issue-p403wy9l6-daniloctms-projects.vercel.app';

// Função para tratar respostas de TEXTO/HTML
const handleTextResponse = async (response: Response) => {
  console.log('[API] Resposta recebida:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    url: response.url
  });

  if (response.ok) {
    const text = await response.text();
    console.log('[API] Texto recebido. Tamanho:', text.length);
    console.log('[API] Tipo de conteúdo:', response.headers.get('content-type'));
    console.log('[API] Primeiros 200 caracteres:', text.substring(0, 200));
    return text;
  }
 
  const errorMessage = `Erro ${response.status} ao buscar o conteúdo.`;
  console.error('[API] Erro na resposta:', errorMessage);
  Alert.alert('Erro na API', errorMessage);
  throw new Error(errorMessage);
};

// Função para tratar respostas JSON
const handleJsonResponse = async (response: Response) => {
  console.log('[API] Resposta JSON recebida:', {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    url: response.url
  });

  // Pega o texto da resposta primeiro para debug
  const responseText = await response.text();
  console.log('[API] Texto da resposta:', responseText);

  if (response.ok) {
    if (response.status === 204) {
      console.log('[API] Status 204 - Sem conteúdo');
      return { success: true };
    }
    
    try {
      // Se não tem conteúdo, retorna sucesso
      if (!responseText.trim()) {
        console.log('[API] Resposta vazia, assumindo sucesso');
        return { success: true, message: 'Operação realizada com sucesso' };
      }

      const json = JSON.parse(responseText);
      console.log('[API] JSON parseado com sucesso:', json);
      return json;
    } catch (jsonError) {
      console.log('[API] Erro ao parsear JSON:', jsonError);
      console.log('[API] Conteúdo que falhou ao parsear:', responseText);
      
      // Se a resposta foi bem-sucedida mas não é JSON válido, assume sucesso
      return { success: true, message: 'Operação realizada com sucesso' };
    }
  }

  // Tratamento de erro
  console.error('[API] Resposta de erro:', {
    status: response.status,
    statusText: response.statusText,
    body: responseText
  });

  let errorMessage = `Erro ${response.status}`;
  
  try {
    if (responseText.trim()) {
      const errorData = JSON.parse(responseText);
      errorMessage = errorData.error || errorData.message || errorData.detail || errorMessage;
      console.error('[API] Erro JSON parseado:', errorData);
    } else {
      errorMessage = response.statusText || errorMessage;
    }
  } catch (parseError) {
    console.error('[API] Erro ao parsear erro JSON:', parseError);
    // Usar o texto bruto se não conseguir parsear
    errorMessage = responseText || response.statusText || 'Erro de comunicação com o servidor';
  }
 
  console.error('[API] Erro final:', errorMessage);
  Alert.alert('Erro na API', errorMessage);
  throw new Error(errorMessage);
};

// --- FUNÇÃO GET PARA HTML ---
export const getHtml = async (endpoint: string): Promise<string> => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('[API] Fazendo requisição GET para HTML:', fullUrl);
 
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'ReactNative/WebView'
      },
    });
   
    return handleTextResponse(response);
  } catch (error) {
    console.error('[API] Erro na requisição HTML:', error);
   
    if (error instanceof Error && error.message.includes('Erro')) {
      throw error;
    }
   
    Alert.alert('Erro de Rede', 'Não foi possível se conectar ao servidor.');
    throw error;
  }
};

// Função GET para JSON
export const get = async <R>(endpoint: string): Promise<R> => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('[API] Fazendo requisição GET para JSON:', fullUrl);
 
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    return handleJsonResponse(response);
  } catch (error) {
    console.error('[API] Erro na requisição GET JSON:', error);
   
    if (error instanceof Error && error.message.includes('Erro')) {
      throw error;
    }
   
    Alert.alert('Erro de Rede', 'Não foi possível se conectar ao servidor.');
    throw error;
  }
};

// Função POST para JSON
export const post = async <T, R>(endpoint: string, data: T): Promise<R> => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('[API] Fazendo requisição POST para JSON:', fullUrl);
  console.log('[API] Dados sendo enviados:', JSON.stringify(data, null, 2));
 
  try {
    const requestBody = JSON.stringify(data);
    console.log('[API] Body da requisição:', requestBody);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: requestBody,
    });

    console.log('[API] Requisição POST enviada, aguardando resposta...');
    return handleJsonResponse(response);
  } catch (error) {
    console.error('[API] Erro na requisição POST:', error);
    
    // Log detalhado do erro
    if (error instanceof TypeError) {
      console.error('[API] Erro de rede/conexão:', error.message);
    } else if (error instanceof Error) {
      console.error('[API] Erro geral:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
   
    if (error instanceof Error && error.message.includes('Erro')) {
      throw error;
    }
   
    Alert.alert('Erro de Rede', 'Não foi possível se conectar ao servidor.');
    throw error;
  }
};