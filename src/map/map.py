import os
import pandas as pd
import folium
from typing import Optional
# Importa o gerenciador de banco de dados do seu projeto de API
from src import database_manager as db

def gerar_mapa_cpted_html(zoom_start: int = 12) -> Optional[str]:
    """
    Gera um mapa Folium como string HTML, consumindo dados diretamente
    do banco de dados.

    Retorna o HTML do mapa ou None se não houver dados para exibir.
    """
    # 1. Busca os dados do banco de dados usando o database_manager
    print("Buscando dados de análise do banco de dados...")
    dados_do_banco = db.get_all_analyses_for_map()

    if not dados_do_banco:
        print("Nenhum dado com coordenadas encontrado no banco de dados para gerar o mapa.")
        return None

    # 2. Converte os dados em um DataFrame do Pandas
    df = pd.DataFrame(dados_do_banco)
    
    # Certifica que as colunas numéricas são do tipo correto
    df['lat'] = pd.to_numeric(df['lat'])
    df['lon'] = pd.to_numeric(df['lon'])
    df['indice_cpted_geral'] = pd.to_numeric(df['indice_cpted_geral'])

    # 3. Função de cor CORRIGIDA: opera com valores numéricos
    def cor_icone(indice: float) -> str:
        if indice < 0.4: return 'red'      # Risco Alto
        if indice < 0.7: return 'orange'   # Risco Moderado
        return 'green'                     # Risco Baixo / Seguro

    # 4. Cria o mapa centrado no primeiro ponto da lista
    centro = [df.iloc[0]['lat'], df.iloc[0]['lon']]
    m = folium.Map(location=centro, zoom_start=zoom_start, tiles="cartodbpositron")

    # 5. Adiciona os marcadores ao mapa
    print(f"Adicionando {len(df)} marcadores ao mapa...")
    for _, row in df.iterrows():
        # Formata o HTML do popup, usando .get() para lidar com valores nulos
        popup_html = f"""
        <div style="width:280px; font-family: sans-serif; font-size: 14px;">
          <h4 style="margin:0 0 10px 0;font-size:16px;">{row.get('titulo_analise', 'Análise Sem Título')}</h4>
          <b>Índice CPTED Geral:</b> {row.get('indice_cpted_geral', 'N/A'):.2f}<br>
          <details style="margin-top:10px;">
            <summary style="cursor:pointer;color:blue;font-size:12px;">Ver detalhes</summary>
            <ul style="padding-left:20px;margin-top:5px; font-size:12px; list-style-type: square;">
              <li><b>Data:</b> {row.get('data_processamento').strftime('%d/%m/%Y %H:%M') if row.get('data_processamento') else 'N/A'}</li>
              <li><b>Resumo:</b> {row.get('resumo_executivo', 'N/A')}</li>
              <li><b>Recomendações:</b> {row.get('recomendacoes', 'N/A')}</li>
            </ul>
          </details>
        </div>
        """
        folium.Marker(
            [row['lat'], row['lon']],
            popup=folium.Popup(popup_html, max_width=300),
            tooltip=row.get('titulo_analise', ''),
            icon=folium.Icon(color=cor_icone(row['indice_cpted_geral']), icon='shield-alt', prefix='fa')
        ).add_to(m)

    # 6. Retorna o HTML completo como uma string
    print("Geração do mapa concluída.")
    return m._repr_html_() # Retorna o HTML completo

# Exemplo de uso:
if __name__ == "__main__":
    # Esta função agora não precisa de nenhum parâmetro para buscar os dados!
    html_mapa = gerar_mapa_cpted_html()

    if html_mapa:
        # Salva o mapa em um arquivo HTML para fácil visualização e teste
        with open("mapa_de_analises.html", "w", encoding='utf-8') as f:
            f.write(html_mapa)
        print("\nMapa salvo com sucesso em 'mapa_de_analises.html'")