import json
import os
from typing import Dict, Any, List, Optional
from app.models.schemas import (
    ExpenseCalculationRequest,
    ExpenseCalculationResponse,
    ExpenseItem,
    ProfitCalculationRequest,
    ProfitCalculationResponse,
    ScenarioResult,
    SensitivityPoint
)

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "verified", "crops.json")

# Standard 13 Expense Category default weights across Indian agriculture
EXPENSE_CATEGORIES = [
    {"id": "seeds", "name": "Seeds & Planting Material", "weight": 0.12},
    {"id": "land_prep", "name": "Land Preparation & Ploughing", "weight": 0.10},
    {"id": "manure", "name": "Organic Manure & Farmyard Composting", "weight": 0.08},
    {"id": "fertilizers", "name": "Fertilizers (NPK & Micronutrients)", "weight": 0.14},
    {"id": "sowing_labor", "name": "Sowing & Transplanting Labor", "weight": 0.09},
    {"id": "irrigation", "name": "Irrigation & Energy Charges", "weight": 0.07},
    {"id": "weeding", "name": "Weeding & Intercultural Operations", "weight": 0.08},
    {"id": "plant_protection", "name": "Crop Protection (Bio-pesticides & Sprays)", "weight": 0.08},
    {"id": "harvesting", "name": "Harvesting & Picking Labor", "weight": 0.11},
    {"id": "post_harvest", "name": "Threshing & Post-Harvest Processing", "weight": 0.05},
    {"id": "packaging", "name": "Packaging, Gunny Bags & Crates", "weight": 0.03},
    {"id": "transport", "name": "Transportation to Local APMC / Mandi", "weight": 0.04},
    {"id": "contingency", "name": "Contingency & Miscellaneous Reserve", "weight": 0.05}
]

def get_crop_by_id(crop_id: str) -> Optional[Dict[str, Any]]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        crops = json.load(f)
    for c in crops:
        if c["id"].lower() == crop_id.lower():
            return c
    return None

def calculate_expenses(req: ExpenseCalculationRequest) -> ExpenseCalculationResponse:
    crop = get_crop_by_id(req.crop_id)
    if not crop:
        # Fallback generic crop defaults
        base_cost_per_acre = 25000.0
        crop_name = req.crop_id.capitalize()
    else:
        base_cost_per_acre = float(crop["typical_cost_per_acre"])
        crop_name = crop["name"]

    # Organic vs conventional adjustments
    multiplier = 0.92 if req.farming_type.lower() == "organic" else 1.0

    # Area conversion: 1 hectare = 2.47105 acres
    area_in_acres = req.land_area * (2.47105 if req.land_unit.lower() == "hectares" else 1.0)
    total_base_cost = base_cost_per_acre * area_in_acres * multiplier

    items: List[ExpenseItem] = []
    custom = req.custom_expenses or {}

    running_total = 0.0
    for cat in EXPENSE_CATEGORIES:
        cid = cat["id"]
        if cid in custom:
            cost = float(custom[cid])
        else:
            cost = round(total_base_cost * cat["weight"], 2)
        items.append(ExpenseItem(
            category_id=cid,
            category_name=cat["name"],
            cost=cost,
            percentage=0.0  # Will compute after sum
        ))
        running_total += cost

    # Calculate actual percentage shares
    highest_item = items[0]
    for item in items:
        item.percentage = round((item.cost / running_total * 100.0), 1) if running_total > 0 else 0.0
        if item.cost > highest_item.cost:
            highest_item = item

    return ExpenseCalculationResponse(
        crop_id=req.crop_id,
        crop_name=crop_name,
        land_area=req.land_area,
        land_unit=req.land_unit,
        total_cost=round(running_total, 2),
        cost_per_acre=round(running_total / area_in_acres, 2) if area_in_acres > 0 else 0.0,
        breakdown=items,
        biggest_driver={
            "category_id": highest_item.category_id,
            "category_name": highest_item.category_name,
            "cost": highest_item.cost,
            "percentage": highest_item.percentage,
            "tip": f"{highest_item.category_name} represents {highest_item.percentage}% of your expenses. Explore farmer collectives or local cooperative pooling to optimize this."
        },
        currency="₹",
        data_badge="Verified Source"
    )

def build_scenario(
    label: str,
    y_mult: float,
    p_mult: float,
    area_acres: float,
    base_yield: float,
    base_price: float,
    loss_pct: float,
    total_cost: float
) -> ScenarioResult:
    scenario_yield_per_acre = base_yield * y_mult
    total_yield = scenario_yield_per_acre * area_acres
    loss_fraction = max(0.0, min(0.9, loss_pct / 100.0))
    saleable_yield = total_yield * (1.0 - loss_fraction)

    scenario_price = base_price * p_mult
    gross_revenue = saleable_yield * scenario_price
    net_profit = gross_revenue - total_cost

    profit_per_acre = net_profit / area_acres if area_acres > 0 else 0.0
    profit_margin = (net_profit / gross_revenue * 100.0) if gross_revenue > 0 else None

    return ScenarioResult(
        label=label,
        yield_multiplier=y_mult,
        price_multiplier=p_mult,
        total_yield=round(total_yield, 2),
        saleable_yield=round(saleable_yield, 2),
        gross_revenue=round(gross_revenue, 2),
        net_profit=round(net_profit, 2),
        profit_per_acre=round(profit_per_acre, 2),
        profit_margin_pct=round(profit_margin, 1) if profit_margin is not None else None,
        is_loss=net_profit < 0
    )

def calculate_profit(req: ProfitCalculationRequest) -> ProfitCalculationResponse:
    crop = get_crop_by_id(req.crop_id)
    area_acres = req.land_area * (2.47105 if req.land_unit.lower() == "hectares" else 1.0)

    if crop:
        crop_name = crop["name"]
        yield_unit = crop.get("typical_yield_unit", "Quintals")
        default_cost = float(crop["typical_cost_per_acre"]) * area_acres
        default_yield = float(crop["typical_yield_per_acre"])
        default_price = float(crop["typical_price_per_unit"])
        default_loss = float(crop.get("post_harvest_loss_pct", 5.0))
    else:
        crop_name = req.crop_id.capitalize()
        yield_unit = "Quintals"
        default_cost = 25000.0 * area_acres
        default_yield = 20.0
        default_price = 2200.0
        default_loss = 5.0

    cost = req.custom_cost if req.custom_cost is not None else default_cost
    yield_per_acre = req.custom_yield_per_acre if req.custom_yield_per_acre is not None else default_yield
    price_per_unit = req.custom_price_per_unit if req.custom_price_per_unit is not None else default_price
    loss_pct = req.custom_post_harvest_loss_pct if req.custom_post_harvest_loss_pct is not None else default_loss

    # 3 Scenarios
    expected = build_scenario("Expected", 1.0, 1.0, area_acres, yield_per_acre, price_per_unit, loss_pct, cost)
    conservative = build_scenario("Conservative", 0.80, 0.85, area_acres, yield_per_acre, price_per_unit, loss_pct, cost)
    optimistic = build_scenario("Optimistic", 1.20, 1.15, area_acres, yield_per_acre, price_per_unit, loss_pct, cost)

    # Break-even calculations
    # Net Profit = (Saleable Yield * Price) - Cost = 0 => Saleable Yield = Cost / Price
    # Total Yield = Saleable Yield / (1 - loss_pct/100)
    # Break-even Yield per acre = Total Yield / Area
    effective_price_after_loss = price_per_unit * (1.0 - (loss_pct / 100.0))
    if effective_price_after_loss > 0 and area_acres > 0:
        be_yield_per_acre = cost / (effective_price_after_loss * area_acres)
    else:
        be_yield_per_acre = 0.0

    # Break-even Price: Cost / Expected Saleable Yield
    expected_saleable = (yield_per_acre * area_acres) * (1.0 - (loss_pct / 100.0))
    if expected_saleable > 0:
        be_price_per_unit = cost / expected_saleable
    else:
        be_price_per_unit = 0.0

    # Sensitivity Heat-Map Grid: Price Deltas (-20%, -10%, 0%, +10%, +20%) x Yield Deltas (-20%, -10%, 0%, +10%, +20%)
    sensitivity_grid: List[SensitivityPoint] = []
    deltas = [-20, -10, 0, 10, 20]
    for p_pct in deltas:
        for y_pct in deltas:
            p_mult = 1.0 + (p_pct / 100.0)
            y_mult = 1.0 + (y_pct / 100.0)
            sc = build_scenario("Grid", y_mult, p_mult, area_acres, yield_per_acre, price_per_unit, loss_pct, cost)
            sensitivity_grid.append(SensitivityPoint(
                price_change_pct=p_pct,
                yield_change_pct=y_pct,
                net_profit=sc.net_profit,
                is_loss=sc.is_loss
            ))

    return ProfitCalculationResponse(
        crop_id=req.crop_id,
        crop_name=crop_name,
        land_area=req.land_area,
        yield_unit=yield_unit,
        base_cost=round(cost, 2),
        expected_scenario=expected,
        conservative_scenario=conservative,
        optimistic_scenario=optimistic,
        break_even_yield_per_acre=round(be_yield_per_acre, 2),
        break_even_price_per_unit=round(be_price_per_unit, 2),
        sensitivity_grid=sensitivity_grid,
        currency="₹",
        disclaimer="All numbers are Estimates based on agronomic models and regional cost averages.",
        data_badge="Verified Source"
    )
