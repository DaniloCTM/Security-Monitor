import pandas as pd
import folium

def gerar_mapa_cpted_html(csv_path: str,
                          coords: list[tuple[float,float]],
                          zoom_start: int = 12) -> str:
    """
    Gera um mapa Folium como string HTML contendo todos os assets inline
    (CSS/JS) para injetar direto num template ou retornar numa API.
    """
    # Lê CSV e injeta coords
    df = pd.read_csv(csv_path).head(len(coords))
    df['lat'], df['lon'] = zip(*coords)

    # Função de cor (fraco = alto risco, etc)
    def cor_icone(risco: str) -> str:
        r = risco.lower()
        if 'fraco' in r:      return 'red'
        if 'moderado' in r:   return 'orange'
        if 'forte' in r:      return 'green'
        return 'gray'

    # Cria mapa centrado no primeiro ponto
    centro = [df.iloc[0]['lat'], df.iloc[0]['lon']]
    m = folium.Map(location=centro, zoom_start=zoom_start)

    # Adiciona marcadores com <details>
    for _, row in df.iterrows():
        popup_html = f"""
        <div style="width:250px;">
          <strong>{row['titulo_analise']}</strong><br>
          Índice CPTED: <em>{row['indice_cpted_geral']}</em><br>
          <details>
            <summary style="cursor:pointer;color:blue;">Ver mais</summary>
            <ul style="padding-left:1em;margin:0;">
              <li><strong>Data:</strong> {row.get('data_analise','—')}</li>
              <li><strong>Resumo:</strong> {row.get('resumo_executivo','—')}</li>
              <li><strong>Recomendações:</strong> {row.get('recomendacao','—')}</li>
            </ul>
          </details>
        </div>
        """
        folium.Marker(
            [row['lat'], row['lon']],
            popup=folium.Popup(popup_html, max_width=300),
            icon=folium.Icon(color=cor_icone(row['indice_cpted_geral']))
        ).add_to(m)

    # Retorna o HTML completo como string
    return m.get_root().render()

# Exemplo de uso:
if __name__ == "__main__":
    csv_file = "/home/lucas/dev/Security-Monitor/src/data/reports/relatorio_cpted_multiplas_analises.csv"
    coordenadas = [
        (-15.7939, -47.8828),
        (-15.7990, -47.8650),
        (-15.7600, -47.9000)
    ]
    html_map = gerar_mapa_cpted_html(csv_file, coordenadas)

    print(html_map[:200] + '...')
