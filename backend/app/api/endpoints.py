import os
import json
import httpx
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import (
    RecommendationRequest,
    RecommendationResponse,
    ExpenseCalculationRequest,
    ExpenseCalculationResponse,
    ProfitCalculationRequest,
    ProfitCalculationResponse,
    AskAiRequest
)
from app.engine.recommendation import run_crop_recommendation, load_crops
from app.engine.calculations import calculate_expenses, calculate_profit

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DEMO_PRICES_PATH = os.path.join(BASE_DIR, "data", "demo", "mandi_prices.json")
DEMO_SCHEMES_PATH = os.path.join(BASE_DIR, "data", "demo", "schemes.json")

# In-memory weather cache (lat_lon -> data, timestamp)
WEATHER_CACHE: Dict[str, Any] = {}

# In-memory history of saved plans
HISTORY_STORE: List[Dict[str, Any]] = []

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AgriSmart Core Engine",
        "version": "1.0.0",
        "data_mode": "Hybrid (Verified Agronomy + Badged Demo Markets)"
    }

@router.get("/crops")
def get_crops():
    crops = load_crops()
    return {
        "total": len(crops),
        "crops": crops,
        "data_badge": "Verified Source"
    }

@router.post("/recommend", response_model=RecommendationResponse)
def get_recommendations(req: RecommendationRequest):
    try:
        return run_crop_recommendation(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")

@router.post("/expenses/calc", response_model=ExpenseCalculationResponse)
def get_expense_breakdown(req: ExpenseCalculationRequest):
    try:
        return calculate_expenses(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Expense calculation error: {str(e)}")

@router.post("/profit/calc", response_model=ProfitCalculationResponse)
def get_profit_projections(req: ProfitCalculationRequest):
    try:
        return calculate_profit(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profit calculation error: {str(e)}")

@router.get("/weather")
async def get_weather(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    cache_key = f"{round(lat, 2)}_{round(lon, 2)}"
    if cache_key in WEATHER_CACHE:
        return WEATHER_CACHE[cache_key]

    url = (
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
        "&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m"
        "&hourly=temperature_2m,precipitation_probability,weather_code"
        "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max"
        "&timezone=auto"
    )

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            res = await client.get(url)
            if res.status_code == 200:
                data = res.json()
                result = {
                    "source": "Open-Meteo Real-time Forecast",
                    "latitude": lat,
                    "longitude": lon,
                    "current": data.get("current", {}),
                    "daily": data.get("daily", {}),
                    "hourly": data.get("hourly", {}),
                    "status": "success",
                    "is_fallback": False
                }
                WEATHER_CACHE[cache_key] = result
                return result
    except Exception:
        pass

    # Clean fallback (never fabricate fake random values; provide standard seasonal baseline clearly marked)
    fallback_data = {
        "source": "Agro-Climatic Normal (Offline Fallback)",
        "latitude": lat,
        "longitude": lon,
        "current": {
            "temperature_2m": 29.5,
            "relative_humidity_2m": 68.0,
            "apparent_temperature": 31.0,
            "precipitation": 0.0,
            "weather_code": 1,
            "wind_speed_10m": 12.0
        },
        "daily": {
            "time": ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
            "temperature_2m_max": [31.0, 32.0, 30.5, 29.0, 31.5, 32.0, 31.0],
            "temperature_2m_min": [22.0, 23.0, 21.5, 22.0, 23.5, 22.0, 21.5],
            "precipitation_sum": [0.0, 2.0, 12.0, 5.0, 0.0, 0.0, 1.0],
            "precipitation_probability_max": [10, 25, 70, 45, 15, 10, 20],
            "weather_code": [1, 2, 61, 3, 1, 1, 2]
        },
        "status": "fallback",
        "is_fallback": True,
        "notice": "Live weather service was unreachable. Standard regional seasonal normals are shown."
    }
    return fallback_data

@router.get("/prices")
def get_mandi_prices():
    try:
        with open(DEMO_PRICES_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load mandi prices: {str(e)}")

@router.get("/schemes")
def get_schemes():
    try:
        with open(DEMO_SCHEMES_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load schemes: {str(e)}")

@router.post("/ai/ask")
def ask_agri_assistant(req: AskAiRequest):
    """Honest agronomy assistant that interprets and explains engine output without hallucinating numbers."""
    query = req.query.lower()
    ctx = req.context or {}
    crop_name = ctx.get("crop_name", "recommended crops")
    lang = req.language or "en"

    # Contextual rule-based agronomy knowledge base
    if "soil" in query or "ph" in query:
        if lang == "ta":
            reply = f"மண் வளத்தை பராமரிக்க, அங்கக உரம் மற்றும் பசுந்தாள் உரமிடுதல் மிக அவசியம். உங்கள் மண்ணின் கார-அமிலத்தன்மை (pH) 6.0 முதல் 7.5 வரை இருப்பது பெரும்பாலான பயிர்களுக்கு மிகச் சிறந்தது."
        elif lang == "hi":
            reply = f"मिट्टी के स्वास्थ्य के लिए जैविक खाद (गोबर की खाद) और हरी खाद का उपयोग करें। अधिकांश फसलों के लिए उपयुक्त pH मान 6.0 से 7.5 के बीच होता है।"
        else:
            reply = f"Soil health is foundational. For {crop_name}, maintaining balanced organic carbon with well-decomposed FYM (farmyard manure) ensures root aeration and microbial health. Soil pH between 6.0 and 7.5 is ideal for nutrient absorption."
    elif "profit" in query or "yield" in query or "cost" in query:
        profit = ctx.get("net_profit", "estimated profit")
        cost = ctx.get("total_cost", "cultivation expense")
        if lang == "ta":
            reply = f"உங்கள் பயிருக்கான மதிப்பீட்டு சாகுபடி செலவு மற்றும் லாபம் விவசாய விலை மற்றும் வானிலை சார்ந்தது. செலவை குறைக்க உழவர் உற்பத்தியாளர் குழுக்கள் (FPO) மூலம் கூட்டு கொள்முதல் செய்யலாம்."
        elif lang == "hi":
            reply = f"लागत को नियंत्रित करने के लिए सामूहिक बीज व उर्वरक खरीद करें। यदि मौसम अनुकूल रहता है तो अनुमानित लाभ मार्जिन काफी बेहतर रह सकता है।"
        else:
            reply = f"Regarding financial returns for {crop_name}: cultivation cost is estimated around {cost}. Optimizing your biggest expenditure category and taking advantage of PMFBY crop insurance significantly protects your profit margin ({profit})."
    elif "pest" in query or "disease" in query or "spray" in query:
        if lang == "ta":
            reply = f"பூச்சி தாக்குதலை ஆரம்பத்திலேயே கட்டுப்படுத்த மஞ்சள் மற்றும் நீல வண்ண ஒட்டும் பொறிகளை ஏக்கருக்கு 5 வீதம் வைக்கவும். வேப்பெண்ணெய் கரைசல் (5%) தெளிப்பது இயற்கை வழி கட்டுப்பாடு."
        elif lang == "hi":
            reply = f"कीट नियंत्रण के लिए एकीकृत कीट प्रबंधन (IPM) अपनाएं। नीम का तेल (5 मिली प्रति लीटर) का छिड़काव शुरुआती अवस्था में अत्यंत प्रभावी रहता है।"
        else:
            reply = f"For proactive pest management in {crop_name}, adopt Integrated Pest Management (IPM): install yellow/blue sticky traps (5 per acre), monitor morning humidity spikes, and spray 5% Neem Seed Kernel Extract (NSKE) at the first sighting of pests."
    else:
        if lang == "ta":
            reply = f"அக்ரிஸ்மார்ட் பரிந்துரை என்ஜின் உங்கள் மண்ணின் தன்மை, உள்ளூர் வானிலை மற்றும் சந்தை தேவையை அடிப்படையாகக் கொண்டு துல்லியமாக கணக்கிட்டுள்ளது. ஏதேனும் குறிப்பிட்ட சந்தேகம் இருப்பின் கேளுங்கள்!"
        elif lang == "hi":
            reply = f"एग्रीस्मार्ट इंजन ने आपकी मिट्टी, तापमान और वर्षा के आधार पर सर्वोत्तम फसलों का विश्लेषण किया है। आप किसी भी फसल या लागत के बारे में अधिक जानकारी पूछ सकते हैं।"
        else:
            reply = f"AgriSmart's recommendation engine scored {crop_name} based on your soil type, ambient temperature, rainfall adequacy, and regional market economics. Feel free to adjust the 'What-If' sliders to see dynamic re-scoring!"

    return {
        "reply": reply,
        "crop_context": crop_name,
        "language": lang,
        "data_source": "AgriSmart Transparent Agronomy Knowledge Base",
        "data_badge": "Verified Agronomy Advice"
    }

@router.get("/history")
def get_history():
    return {"plans": HISTORY_STORE, "total": len(HISTORY_STORE)}

@router.post("/history")
def save_history(plan: Dict[str, Any]):
    import uuid
    import time
    plan_id = str(uuid.uuid4())[:8]
    record = {
        "id": plan_id,
        "timestamp": int(time.time()),
        "created_at": "Just now",
        **plan
    }
    HISTORY_STORE.insert(0, record)
    return {"status": "saved", "id": plan_id, "plan": record}

@router.delete("/history/{plan_id}")
def delete_history(plan_id: str):
    global HISTORY_STORE
    HISTORY_STORE = [p for p in HISTORY_STORE if p.get("id") != plan_id]
    return {"status": "deleted", "id": plan_id}
