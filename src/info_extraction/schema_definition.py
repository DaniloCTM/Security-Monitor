from pydantic import BaseModel, Field
from typing import Optional, List

class Localizacao(BaseModel):
    """Descreve o ambiente geral e a localização da cena."""
    tipo_de_ambiente: str = Field(description="O tipo de local (ex: 'rua urbana', 'floresta', 'interior de um escritório').")
    cidade: Optional[str] = Field(default=None, description="A cidade onde a cena ocorre, se mencionada.")
    momento_do_dia: Optional[str] = Field(default=None, description="A parte do dia (ex: 'manhã', 'pôr do sol', 'noite').")
    condicoes_climaticas: Optional[str] = Field(default=None, description="As condições do tempo (ex: 'ensolarado', 'chuvoso').")

class Pessoa(BaseModel):
    """Descreve uma ou mais pessoas na cena."""
    descricao: str = Field(description="Uma breve descrição da aparência, vestimenta ou do grupo de pessoas.")
    acao: str = Field(description="A principal ação que a pessoa ou grupo está realizando (ex: 'caminhando', 'conversando').")
    quantidade: int = Field(default=1, description="Número de pessoas que se encaixam nesta descrição.")

class Estrutura(BaseModel):
    """Descreve uma estrutura arquitetônica, como um prédio ou uma casa."""
    tipo: str = Field(description="O tipo de estrutura (ex: 'prédio de apartamentos', 'loja', 'ponte').")
    estilo_arquitetonico: Optional[str] = Field(default=None, description="O estilo arquitetônico (ex: 'moderno', 'colonial').")
    detalhes: List[str] = Field(description="Uma lista de detalhes observáveis da estrutura, como 'paredes de tijolos aparentes', 'grandes janelas de vidro', 'porta de carvalho'.")

class Veiculo(BaseModel):
    """Descreve um veículo presente na cena."""
    tipo: str = Field(description="O tipo de veículo (ex: 'carro', 'bicicleta', 'ônibus').")
    cor: Optional[str] = Field(default=None, description="A cor do veículo.")
    estado: str = Field(description="A condição ou ação do veículo (ex: 'estacionado', 'em movimento rápido').")

class Objeto(BaseModel):
    """Descreve um objeto notável e genérico na cena que não se encaixa em outras categorias."""
    nome_do_objeto: str = Field(description="O nome do objeto (ex: 'poste de luz', 'banco de praça', 'lixeira').")
    material: Optional[str] = Field(default=None, description="O material principal do objeto (ex: 'metal', 'madeira').")
    quantidade: int = Field(default=1, description="A quantidade de objetos idênticos.")
    detalhes_adicionais: Optional[str] = Field(default=None, description="Qualquer detalhe extra sobre o estado ou aparência do objeto (ex: 'aceso', 'enferrujado').")

class Cena(BaseModel):
    """Estrutura completa para conter todas as informações extraídas de uma descrição de cena."""
    titulo_da_cena: str = Field(description="Um título curto e conciso que resume a cena.")
    localizacao: Localizacao
    pessoas_presentes: List[Pessoa]
    estruturas_presentes: List[Estrutura]
    veiculos_presentes: List[Veiculo]
    objetos_diversos: List[Objeto]