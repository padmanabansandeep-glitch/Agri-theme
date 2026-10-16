# 🌾 AgriSmart Ultra
**AI-Powered Crop Recommendation & Profit Estimation Platform**

AgriSmart Ultra is a production-quality, visually unforgettable precision agriculture platform combining transparent agronomic rule models, microclimate weather tracking, 13-point cost estimation, multi-scenario profit projections, and interactive 3D WebGL experiences.

---

## 🌟 Core Highlights

1. **Honesty Over Hype:**
   - 0% fabricated numbers. Every suitability score and profit figure is labelled **Estimate**.
   - Verified scientific parameters (ICAR & TNAU) are badged **VERIFIED SOURCE** and kept isolated from demonstration APMC market data (**DEMO DATA**).
2. **Farmer-First Design:**
   - Multi-language support: **English**, **தமிழ் (Tamil)**, and **हिन्दी (Hindi)**.
   - Large touch targets, plain agronomic explanations, voice input (Web Speech API), and offline local cache mode.
3. **Interactive 3D WebGL Experiences:**
   - **3D Living Farm Island:** Terraced fields, rotating windmill, winding stream, swaying crops, and day/night/golden-hour lighting syncing with the user's real local time.
   - **3D Soil Core Sample:** Horizon A/B/C core with dynamic N-P-K nutrient particle flow, root visualization, and layer tooltips.
   - **3D Profit Towers:** Rising cost/revenue/profit bars with floating gold coins on profit and dry cracked ground on loss.
   - **3D Crop Growth Scrubber:** Interactive plant lifecycle scrub slider (Seed → Sprout → Vegetative → Flowering → Harvest).
4. **Comprehensive Decision Support:**
   - **Crop Wizard:** 5-step wizard with GPS detection, visual 7-soil cards, DIY Field Jar Test guide, and live confidence score meter.
   - **13-Category Expense Calculator:** Land preparation to mandi delivery with inline editing and primary cost driver insights.
   - **Multi-Scenario Profit Engine:** Conservative, Expected, and Optimistic scenarios with break-even indicators and 25-point sensitivity matrix.
   - **Export Hub:** One-click client-side PDF dossier generation, CSV export, and WhatsApp sharing.
   - **Govt Schemes & Crop Rotation:** Curated schemes (PM-KISAN, PMFBY) and fertility-restoring legume rotation sequences.
   - **"Ask AgriSmart" AI Advisor:** Multilingual agronomic chat with speech input/output.
   - **Command Palette:** Quick-jump modal with `Ctrl + K`.
   - **Easter Egg:** Double-click the logo to activate Golden-Hour sunset mode!

---

## 🚀 Quick Start Guide

### Option A: Local Development

#### 1. Backend (FastAPI + Python 3.12)
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

#### 2. Frontend (React 18 + Vite + TypeScript + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
The web application will open at: `http://localhost:5173`

---

### Option B: Docker Compose
```bash
docker-compose up --build
```
Access the application at `http://localhost:5173`.

---

### Option C: Running Backend Tests
```bash
cd backend
venv\Scripts\python -m pytest tests
```
Validates trapezoidal scoring, 13 expense category balances, profit calculations, break-even formulas, and loss scenarios.

---

## 📂 Repository Structure
```
agrismart/
├─ backend/
│  ├─ app/
│  │  ├─ api/         # FastAPI endpoints (/recommend, /weather, /expenses, /profit, /ai)
│  │  ├─ engine/      # Recommendation scoring & 13-category financial calculations
│  │  ├─ models/      # Pydantic schemas
│  │  └─ main.py      # Application entrypoint with CORS
│  ├─ data/
│  │  ├─ verified/    # ICAR & TNAU peer-reviewed crop parameters (crops.json)
│  │  └─ demo/        # Demo APMC mandi prices and schemes (mandi_prices.json)
│  ├─ tests/          # Pytest unit tests for all mathematical formulas
│  └─ requirements.txt
├─ frontend/
│  ├─ src/
│  │  ├─ 3d/          # Three.js WebGL experiences (FarmHero3D, SoilCore3D, ProfitTowers3D)
│  │  ├─ components/  # Navbar, BottomNav, CommandPalette, JarTestModal, AskAssistantModal
│  │  ├─ pages/       # Dashboard, Recommend, Results, Expenses, Profit, Weather, History, Schemes, Rotation, Explainer
│  │  ├─ lib/         # i18n (EN/TA/HI), Web Audio ambient generator, jsPDF export, API client
│  │  └─ store/       # Persistent reactive state store
│  ├─ tailwind.config.js
│  └─ vite.config.ts
├─ supabase/
│  ├─ migrations/     # PostgreSQL schema and Row Level Security (RLS) policies
│  └─ seed.sql        # Demo initial profiles
├─ docs/
│  ├─ architecture.md # System architecture & data flow diagrams
│  └─ model_card.md   # Agronomic model documentation
├─ docker-compose.yml
├─ .env.example
└─ README.md
```

---

## 🔒 Security & Data Integrity
- User data is secured using Supabase Row Level Security (RLS) policies (`auth.uid() = user_id`).
- All numbers are labelled as *Estimates*.
- Offline fallback prevents network interruptions from breaking farmer access in remote fields.
