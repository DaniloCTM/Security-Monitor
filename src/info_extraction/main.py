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
    """
    A imagem retrata uma cena noturna de uma rua tranquila e mal iluminada. O ambiente parece ser uma área urbana ou suburbana.
    A rua é estreita e tem uma superfície desgastada, com rachaduras e descoloração visíveis. No lado esquerdo, um poste de luz emite uma luz fraca.
    À direita, há um muro branco alto com uma cerca de arame farpado no topo. O local está completamente deserto.
    A atmosfera geral é de abandono e falta de cuidado.
    """,
    # Exemplo 2: Baixo Risco
    """
    Descrição de uma praça pública bem cuidada ao entardecer. A iluminação é excelente, com postes de LED altos e luzes de chão destacando os caminhos.
    Há muitas pessoas no local: crianças brincando em um playground moderno, casais sentados em bancos de madeira limpos e grupos conversando perto de um quiosque de café.
    Os jardins são bem mantidos, com flores coloridas e grama aparada, que servem como barreiras simbólicas claras para as áreas de passagem. Uma câmera de segurança é visível em um poste.
    """,
    # Exemplo 3: Risco Moderado
    """
    Foto de um beco de serviço nos fundos de uma área comercial durante o dia. Funcionários de lojas estão fumando em uma pausa.
    Grandes lixeiras de metal estão alinhadas contra uma parede, criando alguns pontos cegos. Uma das paredes tem pichações extensas.
    A iluminação parece ser apenas uma lâmpada nua, provavelmente ineficaz à noite. A passagem é restrita, mas não há portões, servindo como um atalho para pedestres.
    """
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
    reports_path = "src/info_extraction/reports"
    nome_do_arquivo_csv = os.path.join(reports_path,'relatorio_cpted_multiplas_analises.csv')
    
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
