#!/bin/bash

# Garante que o script pare se qualquer comando falhar
set -e

echo "--- Aguardando emulador ficar online ---"
# Loop até encontrar uma linha que TERMINE com a palavra "device".
# Isso ignora o cabeçalho, dispositivos 'offline' ou 'unauthorized'.
until adb devices | grep -m 1 "device$"; do
  echo "Emulador não encontrado ou está offline. Verifique se ele está rodando e totalmente carregado. Tentando novamente em 2 segundos..."
  sleep 2
done

echo "--- Emulador encontrado e online! ---"

# Extrai o ID (ex: emulator-5554) da primeira linha que termina com "device"
DEVICE_ID=$(adb devices | grep "device$" | awk 'NR==1{print $1}')

echo "ID do dispositivo: $DEVICE_ID"

echo "--- Configurando a ponte reversa para o Metro Bundler ---"
# Agora o comando terá o ID correto e funcionará.
adb -s $DEVICE_ID reverse tcp:8081 tcp:8081

echo "--- Iniciando o Metro Bundler em segundo plano ---"
npx react-native start --reset-cache &

echo "--- Iniciando o build e a instalação do Android ---"
# O --active-arch-only otimiza o build para a arquitetura do emulador conectado.
npx react-native run-android --variant=debug --active-arch-only

# Mantém o container rodando para que possamos ver os logs
exec "$@"