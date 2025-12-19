import os
import requests
from dotenv import load_dotenv

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_API_URL = "https://router.huggingface.co/v1/chat/completions"
MODEL_ID = "Qwen/Qwen2.5-7B-Instruct"

def generate_manifestation(user_profile: dict, rag_context: str = "") -> str:
    """
    Generates a personalized manifestation passage using Hugging Face Router API (OpenAI Compatible).
    """
    if not HF_API_TOKEN:
        raise ValueError("HF_API_TOKEN environment variable is not set.")

    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    
    prompt = f"""You are an expert manifestation coach with knowledge of Vedic astrology, positive psychology,
goal alignment, and motivational narrative design.

Your task is to generate a deeply personalized manifestation passage
that inspires confidence, clarity, and purposeful action.

OUTPUT CONSTRAINTS:
- Length: Between 650 and 750 words (Strictly enforce this range to ensure ~4 minutes of spoken audio)
- Perspective: Second person (“you”, “your”)
- Tense: Present tense only
- Tone: Uplifting, grounded, confident, emotionally supportive
- Output format: Plain text only
- Do NOT include headings, explanations, labels, or quotes

INPUT PARAMETERS (use as semantic context, integrate naturally):
- Preferred Name: {user_profile.get('preferred_name')}
- Date of Birth: {user_profile.get('birth_date')}
- Birth Time: {user_profile.get('birth_time')}
- Birth Place: {user_profile.get('birth_place')}
- Nakshatra: {user_profile.get('nakshatra')}
- Lagna (Ascendant): {user_profile.get('lagna')}
- Star Sign: {user_profile.get('star_sign')}
- Strengths: {user_profile.get('strengths')}
- Areas of Improvement: {user_profile.get('areas_of_improvement')}
- Greatest Achievement in Life: {user_profile.get('greatest_achievement')}
- Major Achievement in the Last One Year: {user_profile.get('recent_achievement')}
- Goals for the Next One Year: {user_profile.get('next_year_goals')}
- Long-Term Life Goals: {user_profile.get('life_goals')}
- Desired Legacy: {user_profile.get('legacy')}
- Primary Manifestation Focus: {user_profile.get('manifestation_focus')}

INSPIRATIONAL CONTEXT (RAG - Wisdom from similar paths):
{rag_context}
(Use the essence of the above context if relevant to reinforce the user's journey, but focus primarily on THEIR specific details.)

NARRATIVE STRATEGY:
- Acknowledge their cosmic imprint using their Nakshatra and Lagna (subtly, not as a horoscope reading, but as energizing traits)
- Woven poetic metaphors of light, growth, and flowing water to describe their journey
- Connect past achievements to present confidence with deep emotional resonance
- Reinforce momentum from recent success as an unstoppable force
- Frame challenges as the forging fire of their character
- Visualize goals as actively unfolding realities, already present in their energy field
- End with a calm, powerful affirmation of identity and direction

QUALITY RULES:
- Use sophisticated, evocative vocabulary (e.g., "illuminate," "resonate," "limitless," "soar")
- Avoid generic affirmations; make every sentence feel handcrafted and profound
- Avoid mystical guarantees, but embrace the magic of belief and psychology
- Maintain high emotional coherence and readability
- Ensure the output length is between 650 and 750 words
- Speak directly to their soul, not just their mind

Generate the manifestation passage now."""

    payload = {
        "model": MODEL_ID,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 2000, # Approx 1500 words capacity
        "temperature": 0.7
    }

    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        # Parse response (OpenAI Format)
        result = response.json()
        if "choices" in result and len(result["choices"]) > 0:
             content = result["choices"][0]["message"]["content"]
             # clean up: remove newlines and extra spaces
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

if __name__ == "__main__":
    # Simple test (requires valid .env)
    test_profile = {
        "preferred_name": "Test User",
        "birth_date": "1990-01-01",
        "star_sign": "Capricorn",
        "strengths": "Resilience",
        "areas_of_improvement": "Patience",
        "greatest_achievement": "Graduated college",
        "recent_achievement": "Got a promotion",
        "next_year_goals": "Learn Python",
        "life_goals": "Travel the world",
        "legacy": "Kindness",
        "manifestation_focus": "Career Success"
    }
    try:
        print(generate_manifestation(test_profile))
    except Exception as e:
        print(e)
