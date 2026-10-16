import pytest
from app.models.schemas import RecommendationRequest, ExpenseCalculationRequest, ProfitCalculationRequest
from app.engine.recommendation import run_crop_recommendation, trapezoidal_score, calculate_soil_score
from app.engine.calculations import calculate_expenses, calculate_profit

def test_trapezoidal_score():
    # Value inside optimal range should score 100
    assert trapezoidal_score(25.0, 18.0, 22.0, 32.0, 40.0) == 100.0
    # Value outside range
    assert trapezoidal_score(10.0, 18.0, 22.0, 32.0, 40.0) < 50.0

def test_soil_affinity_score():
    # Direct match
    assert calculate_soil_score(["alluvial", "loamy"], "alluvial") == 100.0
    # Affinity match
    assert calculate_soil_score(["clay"], "black") == 72.0
    # Incompatible soil
    assert calculate_soil_score(["laterite"], "black") == 35.0

def test_recommendation_completeness_and_confidence():
    # Full inputs
    req_full = RecommendationRequest(
        state="Tamil Nadu",
        soil_type="alluvial",
        ph=6.5,
        nitrogen=140,
        phosphorus=50,
        potassium=150,
        temperature=28.0,
        rainfall=1200.0,
        humidity=75.0,
        land_area=2.0
    )
    res_full = run_crop_recommendation(req_full)
    assert res_full.total_evaluated >= 20
    assert len(res_full.recommendations) > 0
    assert res_full.overall_confidence == 100
    assert len(res_full.missing_inputs) == 0

    # Partial inputs - confidence must drop
    req_partial = RecommendationRequest(
        state="Punjab",
        soil_type="alluvial",
        temperature=20.0
    )
    res_partial = run_crop_recommendation(req_partial)
    assert res_partial.overall_confidence < 100
    assert len(res_partial.missing_inputs) > 0

def test_expense_calculation_13_categories():
    req = ExpenseCalculationRequest(
        crop_id="paddy",
        land_area=2.0,
        land_unit="acres",
        farming_type="Conventional"
    )
    res = calculate_expenses(req)
    assert len(res.breakdown) == 13
    assert res.total_cost > 0
    # Check that sum of percentages equals ~100%
    pct_sum = sum(item.percentage for item in res.breakdown)
    assert 99.0 <= pct_sum <= 101.0
    assert res.biggest_driver["percentage"] > 0

def test_profit_calculation_formulas():
    req = ProfitCalculationRequest(
        crop_id="wheat",
        land_area=2.0,
        land_unit="acres",
        custom_cost=40000.0,
        custom_yield_per_acre=20.0,
        custom_price_per_unit=2500.0,
        custom_post_harvest_loss_pct=5.0
    )
    res = calculate_profit(req)
    
    # Expected scenario verification
    # Total yield = 2 * 20 = 40 quintals
    # Saleable yield = 40 * (1 - 0.05) = 38 quintals
    # Gross revenue = 38 * 2500 = 95,000
    # Net profit = 95,000 - 40,000 = 55,000
    # Profit per acre = 55,000 / 2 = 27,500
    # Profit margin = (55,000 / 95,000) * 100 = ~57.89%
    exp = res.expected_scenario
    assert exp.total_yield == 40.0
    assert exp.saleable_yield == 38.0
    assert exp.gross_revenue == 95000.0
    assert exp.net_profit == 55000.0
    assert exp.profit_per_acre == 27500.0
    assert not exp.is_loss
    assert round(exp.profit_margin_pct, 1) == 57.9

    # Break-even price and yield checks
    # Break-even price = Cost / Saleable yield = 40000 / 38 = ~1052.63
    assert abs(res.break_even_price_per_unit - (40000.0 / 38.0)) < 0.5
    # Sensitivity matrix contains 25 items (5x5)
    assert len(res.sensitivity_grid) == 25

def test_loss_scenario():
    # If cost exceeds gross revenue
    req = ProfitCalculationRequest(
        crop_id="wheat",
        land_area=1.0,
        custom_cost=100000.0,
        custom_yield_per_acre=10.0,
        custom_price_per_unit=2000.0,
        custom_post_harvest_loss_pct=10.0
    )
    res = calculate_profit(req)
    assert res.expected_scenario.net_profit < 0
    assert res.expected_scenario.is_loss is True
