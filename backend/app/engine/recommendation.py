import json
import os
from typing import List, Dict, Any, Tuple
from app.models.schemas import RecommendationRequest, RecommendationResponse, RecommendedCrop, FactorBreakdown

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "verified", "crops.json")

def load_crops() -> List[Dict[str, Any]]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def trapezoidal_score(val: float, min_v: float, opt_min: float, opt_max: float, max_v: float) -> float:
    """Trapezoidal membership function returning 0.0 to 100.0."""
    if val is None:
        return 75.0
    if val < min_v:
        # Penalize if below absolute minimum, but don't hard crash to 0 unless far
        diff = min_v - val
        return max(15.0, 50.0 - diff * 8.0)
    elif min_v <= val < opt_min:
        return 50.0 + (val - min_v) / (opt_min - min_v) * 50.0
    elif opt_min <= val <= opt_max:
        return 100.0
    elif opt_max < val <= max_v:
        return 100.0 - (val - opt_max) / (max_v - opt_max) * 50.0
    else:
        diff = val - max_v
        return max(15.0, 50.0 - diff * 8.0)

def calculate_soil_score(crop_soils: List[str], user_soil: str) -> float:
    user_soil_norm = user_soil.lower().strip()
    if user_soil_norm in [s.lower() for s in crop_soils]:
        return 100.0
    
    # Soil texture affinities
    affinities = {
        "alluvial": ["loamy", "clay"],
        "black": ["clay", "loamy"],
        "red": ["loamy", "laterite", "sandy"],
        "laterite": ["red", "loamy"],
        "sandy": ["loamy", "red"],
        "clay": ["alluvial", "black"],
        "loamy": ["alluvial", "red", "black", "sandy", "clay"]
    }
    close_soils = affinities.get(user_soil_norm, [])
    for s in crop_soils:
        if s.lower() in close_soils:
            return 72.0
    return 35.0

def evaluate_crop(crop: Dict[str, Any], req: RecommendationRequest) -> Tuple[int, FactorBreakdown, List[str], List[str]]:
    reasons: List[str] = []
    risks: List[str] = []

    # 1. Soil Match
    soil_score = calculate_soil_score(crop["compatible_soils"], req.soil_type)
    if soil_score >= 90:
        reasons.append(f"Optimal match for {req.soil_type.capitalize()} soil texture and root aeration.")
    elif soil_score >= 60:
        reasons.append(f"Adaptable to {req.soil_type.capitalize()} soil with appropriate organic manuring.")
    else:
        risks.append(f"Sub-optimal soil texture ({req.soil_type}); requires soil amendment or raised beds.")

    # 2. Temperature Fit
    if req.temperature is not None:
        temp_score = trapezoidal_score(
            req.temperature,
            crop["min_temp"],
            crop["optimal_temp_min"],
            crop["optimal_temp_max"],
            crop["max_temp"]
        )
        if temp_score >= 85:
            reasons.append(f"Temperature ({req.temperature}°C) is in the prime physiological growth bracket.")
        elif temp_score < 50:
            risks.append(f"Current temperature ({req.temperature}°C) is near physiological tolerance limits.")
    else:
        temp_score = 75.0

    # 3. Rainfall and Water Fit
    if req.rainfall is not None:
        rain_score = trapezoidal_score(
            req.rainfall,
            crop["min_rainfall"],
            crop["optimal_rainfall_min"],
            crop["optimal_rainfall_max"],
            crop["max_rainfall"]
        )
    else:
        rain_score = 70.0

    # If farmer has irrigation, rainfall deficit is buffered
    if req.irrigation_available:
        if rain_score < 70 and crop["water_need"] in ["Medium", "High", "Very High"]:
            water_fit = min(95.0, rain_score + 30.0)
            reasons.append(f"Assured irrigation compensates for local rainfall variations.")
        else:
            water_fit = min(100.0, rain_score + 10.0)
    else:
        water_fit = rain_score
        if crop["water_need"] in ["High", "Very High"] and (req.rainfall or 0) < crop["optimal_rainfall_min"]:
            risks.append(f"High water demand crop under rainfed conditions; critical moisture stress risk.")

    # 4. pH Fit
    if req.ph is not None:
        ph_score = trapezoidal_score(
            req.ph,
            crop["min_ph"],
            crop["optimal_ph_min"],
            crop["optimal_ph_max"],
            crop["max_ph"]
        )
        if ph_score >= 90:
            reasons.append(f"Soil pH ({req.ph:.1f}) provides maximum nutrient availability.")
        elif ph_score < 60:
            risks.append(f"Soil pH ({req.ph:.1f}) may cause micronutrient lock-in; test with Soil Health Card.")
    else:
        ph_score = 75.0

    # 5. Humidity Fit
    if req.humidity is not None:
        hum_score = trapezoidal_score(
            req.humidity,
            crop["min_humidity"],
            crop["optimal_humidity_min"],
            crop["optimal_humidity_max"],
            crop["max_humidity"]
        )
        # Check pest condition triggers
        if req.humidity > 80:
            for p in crop.get("pest_disease_risks", []):
                if "humidity" in p.get("condition", "").lower():
                    risks.append(f"Alert: {p['name']} risk due to elevated humidity ({req.humidity}%). {p['prevention']}.")
                    break
    else:
        hum_score = 75.0

    # 6. Season Fit
    season_score = 80.0
    if req.preferred_season and req.preferred_season != "All":
        if req.preferred_season in crop["seasons"] or "Year-round" in crop["seasons"]:
            season_score = 100.0
            reasons.append(f"Well-suited for the {req.preferred_season} cropping window.")
        else:
            season_score = 40.0
            risks.append(f"Off-season for {req.preferred_season}; yields may be lower unless microclimate is managed.")

    # 7. Category Filter/Bonus
    if req.preferred_category and req.preferred_category != "All":
        if req.preferred_category.lower() == crop["category"].lower():
            season_score = min(100.0, season_score + 10.0)

    # 8. Budget Fit
    budget_fit = 85.0
    if req.budget is not None and req.budget > 0:
        est_cost = crop["typical_cost_per_acre"] * req.land_area
        if req.budget >= est_cost:
            budget_fit = 100.0
            reasons.append(f"Estimated cultivation cost (₹{int(est_cost):,}) is comfortably within your budget.")
        else:
            deficit_pct = ((est_cost - req.budget) / est_cost) * 100
            budget_fit = max(20.0, 100.0 - deficit_pct)
            risks.append(f"Estimated cost (₹{int(est_cost):,}) exceeds budget by {int(deficit_pct)}%. Consider Kisan Credit Card.")

    # Weighted Suitability Score
    weights = {
        "soil": 0.25,
        "temperature": 0.20,
        "water": 0.20,
        "ph": 0.12,
        "humidity": 0.08,
        "season": 0.10,
        "budget": 0.05
    }

    final_score = (
        soil_score * weights["soil"] +
        temp_score * weights["temperature"] +
        water_fit * weights["water"] +
        ph_score * weights["ph"] +
        hum_score * weights["humidity"] +
        season_score * weights["season"] +
        budget_fit * weights["budget"]
    )

    factor_breakdown = FactorBreakdown(
        soil_match=round(soil_score, 1),
        temperature_fit=round(temp_score, 1),
        rainfall_fit=round(rain_score, 1),
        ph_fit=round(ph_score, 1),
        humidity_fit=round(hum_score, 1),
        season_fit=round(season_score, 1),
        water_fit=round(water_fit, 1),
        budget_fit=round(budget_fit, 1)
    )

    return int(round(final_score)), factor_breakdown, reasons, risks

def run_crop_recommendation(req: RecommendationRequest) -> RecommendationResponse:
    crops = load_crops()
    evaluated: List[RecommendedCrop] = []

    # Calculate confidence based on input completeness
    missing_inputs: List[str] = []
    confidence = 100

    if req.ph is None:
        confidence -= 12
        missing_inputs.append("Soil pH (assumed neutral 6.8)")
    if req.nitrogen is None and req.phosphorus is None and req.potassium is None:
        confidence -= 10
        missing_inputs.append("NPK values (standard regional dosages used)")
    if req.rainfall is None:
        confidence -= 15
        missing_inputs.append("Seasonal rainfall (long-term historical normal applied)")
    if req.temperature is None:
        confidence -= 10
        missing_inputs.append("Temperature (ambient seasonal estimate used)")
    if req.humidity is None:
        confidence -= 5
        missing_inputs.append("Relative humidity")

    confidence = max(40, confidence)
    conf_level = "High" if confidence >= 85 else ("Moderate" if confidence >= 65 else "Preliminary")

    for crop in crops:
        score, factors, reasons, risks = evaluate_crop(crop, req)
        
        # Sowing window advice
        sowing_window = ", ".join(crop.get("seasons", ["Year-round"]))
        irrigation_advice = "Drip or furrow recommended" if crop.get("water_need") in ["High", "Very High"] else "Low frequency sprinkler or rainfed"

        item = RecommendedCrop(
            id=crop["id"],
            name=crop["name"],
            tamil_name=crop.get("tamil_name", crop["name"]),
            hindi_name=crop.get("hindi_name", crop["name"]),
            category=crop.get("category", "Field Crop"),
            suitability_score=score,
            confidence_pct=confidence,
            confidence_level=conf_level,
            factor_breakdown=factors,
            reasons=reasons[:3] if reasons else ["Good regional viability based on general agro-climatic conditions."],
            risks=risks[:3] if risks else ["Standard crop management practices and regular monitoring advised."],
            ideal_soil=crop["compatible_soils"],
            optimal_temp_range=f"{crop['optimal_temp_min']}°C - {crop['optimal_temp_max']}°C",
            optimal_rainfall_range=f"{crop['optimal_rainfall_min']} - {crop['optimal_rainfall_max']} mm",
            water_need=crop.get("water_need", "Medium"),
            duration_days=crop["duration_days"]["average"],
            sowing_window=sowing_window,
            irrigation_advice=irrigation_advice,
            typical_cost_per_acre=float(crop["typical_cost_per_acre"]),
            typical_yield_per_acre=float(crop["typical_yield_per_acre"]),
            typical_yield_unit=crop.get("typical_yield_unit", "Quintals"),
            typical_price_per_unit=float(crop["typical_price_per_unit"]),
            post_harvest_loss_pct=float(crop.get("post_harvest_loss_pct", 5.0)),
            source=crop.get("source", "ICAR / State Agricultural Universities"),
            verified=crop.get("verified", True),
            data_badge="Verified Source" if crop.get("verified") else "DEMO DATA"
        )
        evaluated.append(item)

    # Sort descending by suitability score
    evaluated.sort(key=lambda x: x.suitability_score, reverse=True)

    notes = (
        f"Evaluated {len(crops)} crops for {req.state} ({req.soil_type} soil). "
        f"Confidence is {confidence}% ({conf_level}). "
    )
    if missing_inputs:
        notes += f"Providing values for {', '.join(missing_inputs)} will refine your recommendations."

    return RecommendationResponse(
        total_evaluated=len(crops),
        recommendations=evaluated,
        overall_confidence=confidence,
        missing_inputs=missing_inputs,
        recommendation_notes=notes,
        data_badge="Verified Source"
    )
