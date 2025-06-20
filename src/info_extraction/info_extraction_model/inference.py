def get_model_structured_response(prompt: str, client, schema: dict):
        """
        Obtém uma resposta estruturada de um modelo de linguagem com base em um prompt e um schema fornecidos.

        Args:
            prompt (str): O texto de entrada a ser enviado ao modelo.
            client: Instância do cliente do modelo de linguagem, que deve possuir o método 'models.generate_content'.
            schema (dict): Esquema JSON que define a estrutura esperada da resposta.

        Returns:
            dict: Resposta do modelo já analisada e estruturada conforme o schema fornecido.

        Raises:
            Exception: Propaga exceções levantadas pelo cliente do modelo durante a geração do conteúdo.
        
        """

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            config={
                "response_mime_type": "application/json",
                "response_schema": schema,
            },
        )
        return response.parsed