# Model Card: AgriSmart Agronomic Suitability Engine

## Model Overview
- **Model Type**: Transparent Rule-Based Fuzzy Scoring with Trapezoidal Membership Functions & Multi-Criteria Decision Analysis (MCDA).
- **Version**: 1.0.0
- **Developers**: AgriSmart Engineering Team
- **Intended Use**: Farmer crop selection guidance, microclimate suitability scoring, and economic break-even planning.

## Input Features
1. `soil_type`: Alluvial, Black, Red, Laterite, Sandy, Clay, Loamy.
2. `ph`: Continuous [3.5 - 10.0].
3. `temperature`: Celsius [-10 - 55].
4. `rainfall`: Seasonal precipitation in millimeters [0 - 5000].
5. `humidity`: Relative humidity percentage [5 - 100].
6. `irrigation_available`: Boolean flag mitigating rainfall deficits.
7. `budget`: Farmer capital availability in INR.
8. `preferred_season`: Kharif, Rabi, Zaid, or All.

## Primary Training & Reference Sources
- **ICAR**: Indian Council of Agricultural Research package of practices (2024).
- **TNAU**: Tamil Nadu Agricultural University Agritech Portal agronomy guides.
- **FAO EcoCrop**: Global crop ecological requirement databases.
- **Open-Meteo**: High-resolution meteorological and solar irradiance forecasts.

## Limitations & Disclaimers
- Macro-level weather averages may not capture extreme microclimatic anomalies (e.g. localized hailstorms or sudden frost pockets).
- Soil test reports (Soil Health Card) should always supersede generalized regional classifications when available.
- All numbers are Estimates intended for decision support, not financial guarantees.
