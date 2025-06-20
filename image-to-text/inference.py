from openai import OpenAI

API_KEY = "_"
BASE_URL = "https://api.kluster.ai/v1"
MODEL_NAME = "Qwen/Qwen2.5-VL-7B-Instruct"

def create_client(api_key=API_KEY, base_url=BASE_URL):
  return OpenAI(api_key=api_key, base_url=base_url)

def build_image_message(image_url, question):
  return [
    {
      "role": "user",
      "content": [
        {"type": "text", "text": question},
        {"type": "image_url", "image_url": {"url": image_url}}
      ]
    }
  ]

def get_image_description(client, image_url, question, model=MODEL_NAME):
  messages = build_image_message(image_url, question)
  completion = client.chat.completions.create(
    model=model,
    messages=messages
  )
  return completion.choices[0].message

def main():
  client = create_client()
  image_url = "https://avenidas.blogfolha.uol.com.br/files/2019/05/73541944dbb06a97f211873046377c77050af17208ee473f9395d3138ae49e71_5ae772e540a2f-768x512.jpg"
  question = "Act as an expert in CPTED (Crime Prevention Through Environmental Design). Analyze the following image of a location and extract the main insights. Base your analysis on the theoretical concepts of surveillance, access control/territoriality, maintenance, and support for legitimate activities."
  description = get_image_description(client, image_url, question)
  print(description)

if __name__ == "__main__":
  main()