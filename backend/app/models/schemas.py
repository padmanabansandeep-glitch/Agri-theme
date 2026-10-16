from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class WeatherRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)

class RecommendationRequest(BaseModel):
    state: str = Field(..., description="Indian State or Region")
    district: Optional[str] = None
    soil_type: str = Field(..., description="alluvial, black, red, laterite, sandy, clay, or loamy")
    ph: Optional[float] = Field(None, ge=3.5, le=10.0, description="Soil pH value")
    nitrogen: Optional[float] = Field(None, ge=0, le=500, description="Available Nitrogen in kg/ha")
    phosphorus: Optional[float] = Field(None, ge=0, le=300, description="Available Phosphorus in kg/ha")
    potassium: Optional[float] = Field(None, ge=0, le=600, description="Available Potassium in kg/ha")
    soil_moisture: Optional[float] = Field(None, ge=0, le=100, description="Soil moisture percentage")
    temperature: Optional[float] = Field(None, ge=-10, le=55, description="Average temperature in Celsius")
    rainfall: Optional[float] = Field(None, ge=0, le=5000, description="Expected seasonal rainfall in mm")
    humidity: Optional[float] = Field(None, ge=5, le=100, description="Relative humidity percentage")
    land_area: float = Field(default=1.0, gt=0, description="Land area in acres or hectares")
    land_unit: str = Field(default="acres", description="'acres' or 'hectares'")
    irrigation_available: bool = Field(default=True)
    water_source: Optional[str] = Field(default="Canal / Borewell", description="Source of irrigation")
    farming_type: Optional[str] = Field(default="Conventional", description="Organic or Conventional")
    budget: Optional[float] = Field(None, ge=0, description="Total budget in INR")
    preferred_season: Optional[str] = Field(None, description="Kharif, Rabi, Zaid, or All")
    preferred_category: Optional[str] = Field(None, description="Cereal, Pulses, Commercial, Vegetable, Fruit, Oilseeds, Plantation, or All")

class FactorBreakdown(BaseModel):
    soil_match: float
    temperature_fit: float
    rainfall_fit: float
    ph_fit: float
    humidity_fit: float
    season_fit: float
    water_fit: float
    budget_fit: float

class RecommendedCrop(BaseModel):
    id: str
    name: str
    tamil_name: str
    hindi_name: str
    category: str
    suitability_score: int
    confidence_pct: int
    confidence_level: str
    factor_breakdown: FactorBreakdown
    reasons: List[str]
    risks: List[str]
    ideal_soil: List[str]
    optimal_temp_range: str
    optimal_rainfall_range: str
    water_need: str
    duration_days: int
    sowing_window: str
    irrigation_advice: str
    typical_cost_per_acre: float
    typical_yield_per_acre: float
    typical_yield_unit: str
    typical_price_per_unit: float
    post_harvest_loss_pct: float
    source: str
    verified: bool
    data_badge: str

class RecommendationResponse(BaseModel):
    total_evaluated: int
    recommendations: List[RecommendedCrop]
    overall_confidence: int
    missing_inputs: List[str]
    recommendation_notes: str
    data_badge: str

class ExpenseItem(BaseModel):
    category_id: str
    category_name: str
    cost: float
    percentage: float

class ExpenseCalculationRequest(BaseModel):
    crop_id: str
    land_area: float = 1.0
    land_unit: str = "acres"
    farming_type: str = "Conventional"
    custom_expenses: Optional[Dict[str, float]] = None

class ExpenseCalculationResponse(BaseModel):
    crop_id: str
    crop_name: str
    land_area: float
    land_unit: str
    total_cost: float
    cost_per_acre: float
    breakdown: List[ExpenseItem]
    biggest_driver: Dict[str, Any]
    currency: str = "₹"
    data_badge: str

class ProfitCalculationRequest(BaseModel):
    crop_id: str
    land_area: float = 1.0
    land_unit: str = "acres"
    custom_cost: Optional[float] = None
    custom_yield_per_acre: Optional[float] = None
    custom_price_per_unit: Optional[float] = None
    custom_post_harvest_loss_pct: Optional[float] = None

class ScenarioResult(BaseModel):
    label: str
    yield_multiplier: float
    price_multiplier: float
    total_yield: float
    saleable_yield: float
    gross_revenue: float
    net_profit: float
    profit_per_acre: float
    profit_margin_pct: Optional[float]
    is_loss: bool

class SensitivityPoint(BaseModel):
    price_change_pct: int
    yield_change_pct: int
    net_profit: float
    is_loss: bool

class ProfitCalculationResponse(BaseModel):
    crop_id: str
    crop_name: str
    land_area: float
    yield_unit: str
    base_cost: float
    expected_scenario: ScenarioResult
    conservative_scenario: ScenarioResult
    optimistic_scenario: ScenarioResult
    break_even_yield_per_acre: float
    break_even_price_per_unit: float
    sensitivity_grid: List[SensitivityPoint]
    currency: str = "₹"
    disclaimer: str = "All numbers are Estimates based on agronomic models and regional cost averages."
    data_badge: str

class AskAiRequest(BaseModel):
    query: str
    context: Optional[Dict[str, Any]] = None
    language: Optional[str] = "en"
