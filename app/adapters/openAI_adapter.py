from typing import List
import openai

class OpenAIAdapter:
    def __init__(self, api_key: str, model: str, max_tokens: int, temperature: float):
        self._openai_client = openai.OpenAI(api_key=api_key)
        self._model = model
        self._max_tokens = max_tokens
        self._temperature = temperature


    def generate_embedding(self, query: str) -> List[float]:
        response = openai.Embedding.create(
            input=query,
            model= "text-embedding-ada-002",
            api_key=self.api_key
        )
        return response['data'][0]['embedding']
        

    def generate_text(self, prompt: str, retrieval_context: str) -> str:
        print(prompt)
        response = self._openai_client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system",
                 "content": f"El contexto es: {retrieval_context}, Responde a la siguiente pregunta porfa: "},
                {"role": "user", "content": prompt},
            ],
            max_tokens=self._max_tokens,
            temperature=self._temperature,
        )
        return response.choices[0].message.content
    
    def generate_text_with_context(self, query: str, context: str) -> str:
        prompt = f"{context}\n\nPregunta: {query}\nRespuesta: "
        return self.generate_text(prompt)
