# Usa uma imagem base otimizada e mantida pela comunidade
FROM reactnativecommunity/react-native-android:latest

# Define o diretório de trabalho dentro do container
WORKDIR /app

# --- Otimização de Cache ---
# Copia PRIMEIRO os arquivos de definição de dependências.
# O Docker só vai re-executar a próxima linha se estes arquivos mudarem.
COPY package*.json ./

# Instala as dependências. Esta camada ficará em cache na maior parte do tempo.
RUN npm install

# Agora, copia o resto do código do seu projeto.
COPY . .

# Dá permissão de execução para nosso script de inicialização.
RUN chmod +x /app/entrypoint.sh

# Expõe a porta do Metro Bundler
EXPOSE 8081

# Define o nosso script inteligente como o ponto de entrada do container.
# Ele será executado toda vez que o container iniciar.
ENTRYPOINT ["/app/entrypoint.sh"]
