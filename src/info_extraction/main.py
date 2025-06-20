from google import genai
import os
import pandas as pd
from pydantic import ValidationError
from info_extraction_model.inference import get_model_structured_response
from info_extraction_model.prompt_config import construct_prompt_cpted
from info_extraction_model.schema_config import AnaliseCptedDoLocal
from info_extraction_model.parsing.output_parsing import achatar_analise

# --- Configuração do Cliente ---
try:
    api_key = os.environ.get('API_KEY')
    client = genai.Client(api_key=api_key)
except Exception as e:
    # Se a chave não for fornecida, o código não executará a chamada de API.
    client = None
    print("Cliente GenAI não configurado.")


descricoes_de_locais = [
    # Exemplo 1: Alto Risco (o mesmo de antes)
   """The image depicts a street scene at night with several individuals walking along the sidewalk. Here\'s an analysis based on the four key components of Crime Prevention Through Environmental Design (CPTED):\n\n1. *Surveillance:\n   - The presence of streetlights provides ambient lighting, which can deter criminal activity by making the area more visible to potential perpetrators. However, the image suggests that the lighting is not sufficient to ensure complete visibility or coverage of the entire area.\n   - There are no visible security cameras or other forms of active surveillance in the image, which could be a concern for maintaining a safe environment.\n\n2. **Access Control/Territoriality:\n   - The sidewalk appears to be relatively clear of obstructions, allowing for easy pedestrian movement. This can contribute to a sense of safety and territoriality for pedestrians.\n   - The presence of parked cars and the lack of barriers or gates near the entrance suggest that access control measures might be minimal. This could make it easier for unauthorized individuals to enter the area.\n   - The signage indicating "No Parking" and "No Stopping" implies some level of territoriality, but the enforcement of these rules is not evident from the image alone.\n\n3. **Maintenance:\n   - The sidewalk looks clean and well-maintained, which can contribute to a positive perception of the area and reduce the likelihood of criminal activity.\n   - The condition of the road and surrounding structures appears to be in good repair, suggesting that regular maintenance is being conducted. However, the overall cleanliness and orderliness of the area could be improved further.\n\n4. **Support for Legitimate Activities:*\n   - The presence of people walking along the sidewalk indicates that the area supports legitimate activities such as commuting, shopping, or socializing.\n   - The image does not show any signs of commercial establishments or public spaces that could provide additional support for legitimate activities, such as cafes, shops, or community centers.\n   - The lack of visible public transportation options or designated areas for waiting could limit the support for legitimate activities in this area.\n\nIn conclusion, while the image shows a relatively clean and well-lit street, there are several areas for improvement in terms of surveillance, access control, maintenance, and support for legitimate activities. Implementing additional security measures, such as surveillance cameras and active patrols, could enhance the safety of the area. Ensuring proper access control through barriers or gates near entrances would also help maintain territoriality. Regular maintenance and the addition of public spaces or commercial establishments could further support legitimate activities in the area."""
]
# --- 4. Processamento em Lote e Geração do CSV ---

# Lista para agregar os resultados de todas as análises
lista_de_resultados_achatados = []

print("Iniciando processamento em lote das descrições...")
# Loop principal para processar cada descrição
for i, descricao in enumerate(descricoes_de_locais):
    print(f"\nProcessando Descrição #{i+1}...")
    try:
        # --- Executando a Extração ---
        analise_cpted: AnaliseCptedDoLocal = get_model_structured_response(construct_prompt_cpted(descricao), client, AnaliseCptedDoLocal)

        # Passo B: Validar o JSON com o modelo Pydantic
        analise_obj = AnaliseCptedDoLocal.model_validate(analise_cpted)
        
        # Passo C: Achatar o objeto validado em um dicionário
        dados_para_linha = achatar_analise(analise_obj)
        
        # Passo D: Adicionar o dicionário à nossa lista de resultados
        lista_de_resultados_achatados.append(dados_para_linha)
        print(f"Descrição #{i+1} processada com sucesso.")
        
    except ValidationError as e:
        print(f"Erro de validação para a Descrição #{i+1}: {e}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado para a Descrição #{i+1}: {e}")

# Passo Final: Criar um DataFrame a partir da lista de resultados e salvar em CSV
if lista_de_resultados_achatados:
    print("\nProcessamento concluído. Criando DataFrame e salvando em CSV...")
    
    df_final = pd.DataFrame(lista_de_resultados_achatados)
    reports_path = "src/data/reports"
    nome_do_arquivo_csv = os.path.join(reports_path,'relatorio_cpted_multiplas_analises1.csv')

    # Garante que o diretório "reports" exista antes de salvar o arquivo
    os.makedirs(os.path.dirname(nome_do_arquivo_csv), exist_ok=True)

    try:
        df_final.to_csv(nome_do_arquivo_csv, index=False)
        print(f"\nArquivo '{nome_do_arquivo_csv}' salvo com sucesso!")
        print(f"O arquivo contém {len(df_final)} linhas, cada uma representando uma análise.")
        
    except Exception as e:
        print(f"Ocorreu um erro ao salvar o arquivo CSV: {e}")
else:
    print("\nNenhuma análise foi processada com sucesso. Nenhum arquivo CSV foi gerado.")
