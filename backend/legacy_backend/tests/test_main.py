import requests
import json

URL = "http://localhost:8000/generate-manifestation"

payload = {
    "preferred_name": "Jane Doe",
    "birth_date": "1995-05-15",
    "birth_time": "10:30 AM",
    "birth_place": "New York, USA",
    "nakshatra": "Rohini",
    "lagna": "Taurus",
    "star_sign": "Taurus",
    "strengths": "Creativity, Empathy",
    "areas_of_improvement": "Time Management",
    "greatest_achievement": "Published a book",
    "recent_achievement": "Learned to code",
    "next_year_goals": "Build a SaaS product",
    "life_goals": "Live by the ocean",
    "legacy": "Inspiring others to create",
    "manifestation_focus": "Career Growth"
}

def test_generate_manifestation():
    print("Sending request to AffirmAI (requests)...")
    try:
        response = requests.post(URL, json=payload)
        
        # Check for error response first
        if response.status_code != 200:
            print(f"FAILED with {response.status_code}")
            try:
                print(response.json())
            except:
                print(response.text)
            return

        data = response.json()
        
        print("\n--- Manifestation Text ---")
        text = data.get("manifestation_text", "")
        print(text[:200] + "...")
        print(f"Word count approx: {len(text.split())}")
        
        print("\n--- Audio Path ---")
        print(data.get("audio_path"))
        
        print("\n--- Qdrant Point ID ---")
        print(data.get("qdrant_point_id"))
        
        # Basic assertions
        assert response.status_code == 200
        assert "manifestation_text" in data
        assert "audio_path" in data
        assert "qdrant_point_id" in data
        assert len(text.split()) > 100 # Expecting roughly 500
        
        print("\n✅ Test Passed Successfully!")
        
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")

if __name__ == "__main__":
    test_generate_manifestation()
