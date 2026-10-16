// AgriSmart Multilingual Dictionary: English, தமிழ் (Tamil), हिन्दी (Hindi)

export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  demoBadge: string;
  verifiedBadge: string;
  nav: {
    dashboard: string;
    recommend: string;
    results: string;
    expenses: string;
    profit: string;
    weather: string;
    history: string;
    schemes: string;
    rotation: string;
    explainer: string;
    login: string;
    logout: string;
    guest: string;
  };
  dashboard: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    farmScore: string;
    farmScoreTip: string;
    weatherCardTitle: string;
    soilCardTitle: string;
    quickRecommend: string;
    mandiTicker: string;
    todaysTip: string;
    activeAlerts: string;
    noAlerts: string;
    viewAllCrops: string;
  };
  wizard: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    locationTitle: string;
    soilTitle: string;
    weatherTitle: string;
    preferencesTitle: string;
    reviewTitle: string;
    useGps: string;
    gpsFetching: string;
    jarTestBtn: string;
    confidenceLabel: string;
    autoWeather: string;
    manualWeather: string;
    submitBtn: string;
    calculating: string;
    voiceActive: string;
    voiceStart: string;
  };
  results: {
    topRecommendations: string;
    suitabilityScore: string;
    confidence: string;
    whySuits: string;
    risks: string;
    sowingWindow: string;
    waterNeed: string;
    duration: string;
    planExpenses: string;
    compareBtn: string;
    whatIfTitle: string;
    explainabilityTitle: string;
    factorWeights: string;
  };
  expenses: {
    title: string;
    subtitle: string;
    totalCost: string;
    perAcre: string;
    biggestDriver: string;
    savePlan: string;
    customisePrompt: string;
  };
  profit: {
    title: string;
    subtitle: string;
    conservative: string;
    expected: string;
    optimistic: string;
    grossRevenue: string;
    netProfit: string;
    estimatedLoss: string;
    breakEvenYield: string;
    breakEvenPrice: string;
    profitMargin: string;
    sensitivityTitle: string;
    view3D: string;
    view2D: string;
    exportPdf: string;
    exportCsv: string;
    shareWhatsApp: string;
  };
  common: {
    acres: string;
    hectares: string;
    estimateDisclaimer: string;
    demoNotice: string;
    close: string;
    cancel: string;
    apply: string;
    retry: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "AgriSmart Ultra",
    tagline: "AI Crop Intelligence & Profit Engine",
    demoBadge: "DEMO DATA",
    verifiedBadge: "VERIFIED SOURCE",
    nav: {
      dashboard: "Dashboard",
      recommend: "Crop Wizard",
      results: "Recommendations",
      expenses: "Cost Calculator",
      profit: "Profit Projection",
      weather: "Live Weather",
      history: "Saved Plans",
      schemes: "Govt Schemes",
      rotation: "Crop Rotation",
      explainer: "How it Works",
      login: "Sign In",
      logout: "Sign Out",
      guest: "Guest Mode"
    },
    dashboard: {
      greetingMorning: "Good Morning",
      greetingAfternoon: "Good Afternoon",
      greetingEvening: "Good Evening",
      farmScore: "Farm Readiness Score",
      farmScoreTip: "Based on soil nutrition, climate alignment, and seasonal timing.",
      weatherCardTitle: "Local Agro-Weather",
      soilCardTitle: "Soil Core Profile",
      quickRecommend: "Run Crop Recommendation",
      mandiTicker: "Live APMC Mandi Benchmark Prices",
      todaysTip: "Today's Agronomic Tip",
      activeAlerts: "Weather & Agronomy Alerts",
      noAlerts: "No critical climate risks detected for your region today.",
      viewAllCrops: "Explore All Crops"
    },
    wizard: {
      step1: "Location",
      step2: "Soil Health",
      step3: "Weather",
      step4: "Preferences",
      step5: "Review",
      locationTitle: "Farm Location & Geography",
      soilTitle: "Soil Classification & Nutrients",
      weatherTitle: "Microclimate & Rainfall",
      preferencesTitle: "Farm Budget & Cultivation Goals",
      reviewTitle: "Review & Compute Best Matches",
      useGps: "Detect via GPS",
      gpsFetching: "Locating farm coordinates...",
      jarTestBtn: "Don't know your soil? Field Jar Test Guide",
      confidenceLabel: "Recommendation Confidence",
      autoWeather: "Auto-Fetch Live Weather",
      manualWeather: "Manual Climate Entry",
      submitBtn: "Recommend Best Crops",
      calculating: "Scoring 30+ crops against your soil and climate...",
      voiceStart: "Speak to Fill",
      voiceActive: "Listening (Tamil / Hindi / English)..."
    },
    results: {
      topRecommendations: "Top Recommended Crops for Your Land",
      suitabilityScore: "Suitability Score",
      confidence: "Confidence",
      whySuits: "Why This Crop Suits Your Land",
      risks: "Agronomic Risks & Prevention",
      sowingWindow: "Ideal Sowing Window",
      waterNeed: "Water Requirement",
      duration: "Duration",
      planExpenses: "Calculate Expenses & Profit",
      compareBtn: "Compare Crops",
      whatIfTitle: "What-If Real-Time Simulation",
      explainabilityTitle: "Transparent Factor Breakdown",
      factorWeights: "Agronomic Weighting Model"
    },
    expenses: {
      title: "13-Point Cultivation Expense Calculator",
      subtitle: "Comprehensive cost structure from land preparation to local APMC mandi delivery.",
      totalCost: "Total Estimated Investment",
      perAcre: "Per Acre Cost",
      biggestDriver: "Primary Cost Driver",
      savePlan: "Save Cultivation Plan",
      customisePrompt: "All values are regional benchmarks. You can edit any field to match your actual local prices."
    },
    profit: {
      title: "Yield, Revenue & Net Profit Estimation",
      subtitle: "Multi-scenario risk assessment with break-even indicators and sensitivity analysis.",
      conservative: "Conservative (-20% Yield, -15% Price)",
      expected: "Expected Normal",
      optimistic: "Optimistic (+20% Yield, +15% Price)",
      grossRevenue: "Gross Revenue",
      netProfit: "Net Profit",
      estimatedLoss: "Estimated Loss",
      breakEvenYield: "Break-even Yield Required",
      breakEvenPrice: "Break-even Price Required",
      profitMargin: "Net Profit Margin",
      sensitivityTitle: "Price × Yield Sensitivity Heatmap",
      view3D: "3D Profit Towers",
      view2D: "2D Visual Breakdown",
      exportPdf: "Download PDF Report",
      exportCsv: "Export CSV Data",
      shareWhatsApp: "Share via WhatsApp"
    },
    common: {
      acres: "Acres",
      hectares: "Hectares",
      estimateDisclaimer: "All values are Estimates intended for decision support. Consult your local Krishi Vigyan Kendra (KVK).",
      demoNotice: "Sample data is clearly badged DEMO DATA and separated from verified agronomy sources.",
      close: "Close",
      cancel: "Cancel",
      apply: "Apply",
      retry: "Retry"
    }
  },
  ta: {
    appName: "அக்ரிஸ்மார்ட் அல்ட்ரா",
    tagline: "செயற்கை நுண்ணறிவு பயிர் பரிந்துரை & லாபக் கணக்கீடு",
    demoBadge: "மாதிரித் தகவல் (DEMO)",
    verifiedBadge: "உறுதிப்படுத்தப்பட்ட தகவல்",
    nav: {
      dashboard: "முகப்பு",
      recommend: "பயிர் வழிகாட்டி",
      results: "பரிந்துரைகள்",
      expenses: "செலவு கணக்கீடு",
      profit: "லாப மதிப்பீடு",
      weather: "வானிலை",
      history: "சேமிக்கப்பட்டவை",
      schemes: "அரசு திட்டங்கள்",
      rotation: "பயிர் சுழற்சி",
      explainer: "எவ்வாறு செயல்படுகிறது?",
      login: "உள்நுழை",
      logout: "வெளியேறு",
      guest: "விருந்தினர் பயன்முறை"
    },
    dashboard: {
      greetingMorning: "காலை வணக்கம்",
      greetingAfternoon: "மதிய வணக்கம்",
      greetingEvening: "மாலை வணக்கம்",
      farmScore: "பண்ணை தயார்நிலை மதிப்பீடு",
      farmScoreTip: "மண் சத்துக்கள், தட்பவெப்பநிலை மற்றும் பருவகாலத்தை அடிப்படையாகக் கொண்டது.",
      weatherCardTitle: "உள்ளூர் வானிலை",
      soilCardTitle: "மண் விவரக்குறிப்பு",
      quickRecommend: "பயிர் பரிந்துரை பெறுக",
      mandiTicker: "நேரடி வேளாண் சந்தை விலை நிலவரம்",
      todaysTip: "இன்றைய விவசாய ஆலோசனை",
      activeAlerts: "வானிலை & நோய் எச்சரிக்கைகள்",
      noAlerts: "இன்று உங்கள் பகுதிக்கு தீவிர வானிலை ஆபத்துக்கள் இல்லை.",
      viewAllCrops: "அனைத்து பயிர்களையும் காண்க"
    },
    wizard: {
      step1: "இடம்",
      step2: "மண் வளம்",
      step3: "வானிலை",
      step4: "முன்னுரிமைகள்",
      step5: "சரிபார்ப்பு",
      locationTitle: "பண்ணை இருப்பிடம் & பூகோளம்",
      soilTitle: "மண் வகை & சத்துக்கள்",
      weatherTitle: "தட்பவெப்பம் & மழையளவு",
      preferencesTitle: "முதலீட்டு வரவு & இலக்கு",
      reviewTitle: "சரிபார்த்து பரிந்துரை பெறுக",
      useGps: "GPS மூலம் தானாக கண்டறி",
      gpsFetching: "இருப்பிடம் பெறப்படுகிறது...",
      jarTestBtn: "மண் வகை தெரியாதா? கண்ணாடி பாட்டில் களப் பரிசோதனை",
      confidenceLabel: "பரிந்துரை துல்லியம்",
      autoWeather: "நேரடி வானிலையை பெறுக",
      manualWeather: "கைமுறையாக உள்ளிடுக",
      submitBtn: "சிறந்த பயிர்களை பரிந்துரை செய்",
      calculating: "உங்கள் மண்ணிற்கு ஏற்ற 30+ பயிர்கள் கணக்கிடப்படுகின்றன...",
      voiceStart: "பேசி நிரப்புக",
      voiceActive: "கேட்கிறது (தமிழ் / இந்தி / ஆங்கிலம்)..."
    },
    results: {
      topRecommendations: "உங்கள் நிலத்திற்கான சிறந்த பயிர்கள்",
      suitabilityScore: "பொருத்த மதிப்பெண்",
      confidence: "துல்லியம்",
      whySuits: "ஏன் இந்த பயிர் உங்கள் நிலத்திற்கு ஏற்றது?",
      risks: "பூச்சி/நோய் அபாயங்கள் & தடுப்பு முறைகள்",
      sowingWindow: "பருவ விதைப்பு காலம்",
      waterNeed: "தண்ணீர் தேவை",
      duration: "பயிர் காலம்",
      planExpenses: "செலவு & லாபத்தை கணக்கிடுக",
      compareBtn: "பயிர்களை ஒப்பிடுக",
      whatIfTitle: "மாற்று சூழல் பரிசோதனை (What-If)",
      explainabilityTitle: "வெளிப்படையான மதிப்பீட்டுக் காரணிகள்",
      factorWeights: "வேளாண் எடையிடல் முறை"
    },
    expenses: {
      title: "13-நிலை விரிவான சாகுபடி செலவு கணக்கீடு",
      subtitle: "நில உழவு முதல் சந்தை கொண்டு சேர்க்கும் வரை முழுமையான செலவு விவரம்.",
      totalCost: "மொத்த முதலீட்டு மதிப்பீடு",
      perAcre: "ஏக்கர் ஒன்றுக்கான செலவு",
      biggestDriver: "அதிக செலவாகும் காரணி",
      savePlan: "திட்டத்தை சேமி",
      customisePrompt: "அனைத்து மதிப்புகளும் வட்டார சராசரி அளவுகள். உங்கள் உள்ளூர் விலைக்கு ஏற்ப மாற்றிக் கொள்ளலாம்."
    },
    profit: {
      title: "மகசூல், வருமானம் & நிகர லாப மதிப்பீடு",
      subtitle: "இடர் பகுப்பாய்வு மற்றும் உணர்திறன் அட்டவணையுடன் கூடிய மதிப்பீடு.",
      conservative: "குறைந்தபட்ச சூழல் (-20% மகசூல்)",
      expected: "எதிர்பார்க்கப்படும் இயல்பான சூழல்",
      optimistic: "அதிகபட்ச சாதக சூழல் (+20% மகசூல்)",
      grossRevenue: "மொத்த வருவாய்",
      netProfit: "நிகர லாபம்",
      estimatedLoss: "மதிப்பீட்டு இழப்பு",
      breakEvenYield: "செலவு ஈடுசெய்ய தேவையான மகசூல்",
      breakEvenPrice: "செலவு ஈடுசெய்ய தேவையான விலை",
      profitMargin: "லாப விகிதம்",
      sensitivityTitle: "விலை × மகசூல் உணர்திறன் அட்டவணை",
      view3D: "3D லாப கோபுரங்கள்",
      view2D: "2D வரைபடம்",
      exportPdf: "PDF அறிக்கை பதிவிறக்குக",
      exportCsv: "CSV தரவு பதிவிறக்குக",
      shareWhatsApp: "வாட்ஸ்அப் மூலம் பகிர்க"
    },
    common: {
      acres: "ஏக்கர்",
      hectares: "ஹெக்டேர்",
      estimateDisclaimer: "அனைத்து எண்களும் முடிவெடுப்பதற்கான மதிப்பீடுகள் மட்டுமே. உள்ளூர் வேளாண் அலுவலகத்தை அணுகவும்.",
      demoNotice: "மாதிரித் தகவல் தெளிவாக DEMO DATA என குறிக்கப்பட்டுள்ளது.",
      close: "மூடு",
      cancel: "ரத்து செய்",
      apply: "பயன்படுத்து",
      retry: "மீண்டும் முயற்சி"
    }
  },
  hi: {
    appName: "एग्रीस्मार्ट अल्ट्रा",
    tagline: "एआई संचालित फसल अनुशंसा एवं लाभ पूर्वानुमान",
    demoBadge: "डेमो डेटा (DEMO)",
    verifiedBadge: "सत्यापित स्रोत",
    nav: {
      dashboard: "डैशबोर्ड",
      recommend: "फसल चयन विज़ार्ड",
      results: "अनुशंसाएं",
      expenses: "लागत कैलकुलेटर",
      profit: "लाभ पूर्वानुमान",
      weather: "मौसम",
      history: "सहेजे गए प्लान",
      schemes: "सरकारी योजनाएं",
      rotation: "फसल चक्र",
      explainer: "प्रणाली कैसे काम करती है?",
      login: "लॉग इन",
      logout: "लॉग आउट",
      guest: "अतिथि मोड"
    },
    dashboard: {
      greetingMorning: "शुभ प्रभात",
      greetingAfternoon: "शुभ दोपहर",
      greetingEvening: "शुभ संध्या",
      farmScore: "फार्म तत्परता स्कोर",
      farmScoreTip: "मृदा स्वास्थ्य, जलवायु और बुवाई समय के आधार पर।",
      weatherCardTitle: "स्थानीय मौसम",
      soilCardTitle: "मृदा प्रोफाइल",
      quickRecommend: "फसल अनुशंसा प्राप्त करें",
      mandiTicker: "मंडी जिंस भाव (एपीएमसी)",
      todaysTip: "आज की कृषि सलाह",
      activeAlerts: "मौसम एवं कीट चेतावनी",
      noAlerts: "आज आपके क्षेत्र में कोई गंभीर मौसम जोखिम नहीं है।",
      viewAllCrops: "सभी फसलें देखें"
    },
    wizard: {
      step1: "स्थान",
      step2: "मृदा स्वास्थ्य",
      step3: "मौसम",
      step4: "प्राथमिकताएं",
      step5: "समीक्षा",
      locationTitle: "खेत का स्थान एवं क्षेत्र",
      soilTitle: "मिट्टी का प्रकार एवं पोषक तत्व",
      weatherTitle: "तापमान एवं वर्षा",
      preferencesTitle: "बजट एवं खेती के लक्ष्य",
      reviewTitle: "समीक्षा एवं सर्वोत्तम फसल गणना",
      useGps: "GPS द्वारा स्थान प्राप्त करें",
      gpsFetching: "खेत के निर्देशांक प्राप्त हो रहे हैं...",
      jarTestBtn: "मिट्टी का प्रकार नहीं जानते? जार टेस्ट गाइड",
      confidenceLabel: "अनुशंसा विश्वसनीयता",
      autoWeather: "लाइव मौसम प्राप्त करें",
      manualWeather: "मैनुअल प्रविष्टि",
      submitBtn: "सर्वोत्तम फसलें खोजें",
      calculating: "आपकी मिट्टी और जलवायु के अनुकूल 30+ फसलों का विश्लेषण...",
      voiceStart: "बोलकर भरें",
      voiceActive: "सुन रहे हैं (हिन्दी / தமிழ் / English)..."
    },
    results: {
      topRecommendations: "आपकी भूमि के लिए सर्वोत्तम अनुशंसित फसलें",
      suitabilityScore: "अनुकूलता स्कोर",
      confidence: "विश्वसनीयता",
      whySuits: "यह फसल आपकी भूमि के लिए उपयुक्त क्यों है?",
      risks: "कीट एवं रोग जोखिम व रोकथाम",
      sowingWindow: "बुवाई का समय",
      waterNeed: "पानी की आवश्यकता",
      duration: "फसल अवधि",
      planExpenses: "लागत एवं लाभ की गणना करें",
      compareBtn: "फसलों की तुलना करें",
      whatIfTitle: "What-If वास्तविक समय सिमुलेशन",
      explainabilityTitle: "पारदर्शी कारक विश्लेषण",
      factorWeights: "कृषि विज्ञान वेटिंग मॉडल"
    },
    expenses: {
      title: "13-बिंदु व्यापक खेती लागत कैलकुलेटर",
      subtitle: "खेत की तैयारी से लेकर स्थानीय मंडी परिवहन तक संपूर्ण खर्च।",
      totalCost: "कुल अनुमानित निवेश",
      perAcre: "प्रति एकड़ लागत",
      biggestDriver: "सबसे बड़ा व्यय कारक",
      savePlan: "प्लान सहेजें",
      customisePrompt: "सभी मान क्षेत्रीय मानक हैं। आप अपने स्थानीय मूल्य के अनुसार बदलाव कर सकते हैं।"
    },
    profit: {
      title: "उपज, राजस्व एवं शुद्ध लाभ पूर्वानुमान",
      subtitle: "मल्टी-परिदृश्य जोखिम मूल्यांकन एवं संवेदनशीलता विश्लेषण।",
      conservative: "रूढ़िवादी परिदृश्य (-20% उपज)",
      expected: "सामान्य अपेक्षित परिदृश्य",
      optimistic: "आशावादी परिदृश्य (+20% उपज)",
      grossRevenue: "सकल राजस्व",
      netProfit: "शुद्ध लाभ",
      estimatedLoss: "अनुमानित हानि",
      breakEvenYield: "लागत निकालने हेतु आवश्यक उपज",
      breakEvenPrice: "लागत निकालने हेतु आवश्यक भाव",
      profitMargin: "शुद्ध लाभ मार्जिन",
      sensitivityTitle: "भाव × उपज संवेदनशीलता मैट्रिक्स",
      view3D: "3D लाभ मीनारें",
      view2D: "2D चार्ट",
      exportPdf: "PDF रिपोर्ट डाउनलोड",
      exportCsv: "CSV डेटा डाउनलोड",
      shareWhatsApp: "व्हाट्सएप पर साझा करें"
    },
    common: {
      acres: "एकड़",
      hectares: "हेक्टेयर",
      estimateDisclaimer: "सभी संख्याएं केवल निर्णय सहायता हेतु अनुमान हैं। कृषि विज्ञान केंद्र से संपर्क करें।",
      demoNotice: "नमूना डेटा को स्पष्ट रूप से DEMO DATA चिह्नित किया गया है।",
      close: "बंद करें",
      cancel: "रद्द करें",
      apply: "लागू करें",
      retry: "पुनः प्रयास"
    }
  }
};
