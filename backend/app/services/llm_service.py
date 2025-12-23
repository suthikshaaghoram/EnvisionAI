import requests
from app.core.config import settings
from app.utils.prompt_builder import build_manifestation_prompt

HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"

def generate_manifestation(user_profile: dict, rag_context: str = "") -> str:
    """
    Generates a personalized manifestation passage using Hugging Face Router API.
    """
    if not settings.HF_API_TOKEN:
        raise ValueError("HF_API_TOKEN environment variable is not set.")

    headers = {"Authorization": f"Bearer {settings.HF_API_TOKEN}"}
    prompt = build_manifestation_prompt(user_profile, rag_context)
    
    payload = {
        "model": MODEL_ID,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 2000, 
        "temperature": 0.7
    }

    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        if "choices" in result and len(result["choices"]) > 0:
             content = result["choices"][0]["message"]["content"]
             return " ".join(content.split())
        elif "error" in result:
             raise Exception(f"Hugging Face API Error: {result['error']}")
        else:
             return "Error: Unexpected response format from AI provider."
             
    except requests.exceptions.RequestException as e:
        print(f"Error calling Hugging Face API: {e}")
        try:
             print(f"Response: {response.text}")
        except:
             pass
        raise e
