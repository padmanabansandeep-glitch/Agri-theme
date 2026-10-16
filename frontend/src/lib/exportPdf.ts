import { jsPDF } from 'jspdf';

export interface PlanReportData {
  cropName: string;
  suitabilityScore: number;
  state: string;
  soilType: string;
  landArea: number;
  landUnit: string;
  totalCost: number;
  grossRevenue: number;
  netProfit: number;
  profitMargin: number;
  yieldPerAcre: number;
  yieldUnit: string;
  pricePerUnit: number;
  beYield: number;
  bePrice: number;
  expenses: Array<{ category_name: string; cost: number; percentage: number }>;
}

export function generatePdfReport(data: PlanReportData) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(22, 101, 52); // Forest Green
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('AgriSmart Ultra', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('AI Crop Intelligence & Profit Estimation Report', 14, 26);

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 145, 18);
  doc.text('Data Source: Verified Agronomy', 145, 26);

  // Crop & Farm Summary Card
  doc.setFillColor(248, 250, 240); // Cream
  doc.roundedRect(14, 44, 182, 38, 3, 3, 'F');
  doc.setDrawColor(220, 252, 231);
  doc.roundedRect(14, 44, 182, 38, 3, 3, 'D');

  doc.setTextColor(31, 41, 55); // Charcoal
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.cropName} - Cultivation Projections`, 20, 54);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Suitability Score: ${data.suitabilityScore}/100`, 20, 64);
  doc.text(`Location: ${data.state}`, 20, 72);
  doc.text(`Soil Texture: ${data.soilType.toUpperCase()}`, 80, 64);
  doc.text(`Plot Area: ${data.landArea} ${data.landUnit}`, 80, 72);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text(`Net Estimated Profit: Rs. ${Math.round(data.netProfit).toLocaleString('en-IN')}`, 130, 64);
  doc.text(`Profit Margin: ${data.profitMargin ? data.profitMargin.toFixed(1) + '%' : 'N/A'}`, 130, 72);

  // Financial Summary Table
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Agronomic & Financial Metrics', 14, 92);

  let y = 100;
  const metrics = [
    ['Expected Yield per Acre', `${data.yieldPerAcre} ${data.yieldUnit}`],
    ['Benchmark Market Price', `Rs. ${data.pricePerUnit.toLocaleString('en-IN')} / ${data.yieldUnit}`],
    ['Total Cultivation Investment', `Rs. ${Math.round(data.totalCost).toLocaleString('en-IN')}`],
    ['Gross Revenue Projection', `Rs. ${Math.round(data.grossRevenue).toLocaleString('en-IN')}`],
    ['Break-Even Yield Required', `${data.beYield.toFixed(2)} ${data.yieldUnit} / Acre`],
    ['Break-Even Price Required', `Rs. ${Math.round(data.bePrice).toLocaleString('en-IN')} / ${data.yieldUnit}`]
  ];

  doc.setFontSize(9);
  metrics.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, 16, y);
    doc.setFont('helvetica', 'bold');
    doc.text(val, 110, y);
    doc.setDrawColor(230, 235, 225);
    doc.line(14, y + 2, 196, y + 2);
    y += 8;
  });

  // Expense Breakdown
  y += 6;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('13-Category Expense Breakdown', 14, y);
  y += 8;

  doc.setFillColor(235, 245, 235);
  doc.rect(14, y - 5, 182, 7, 'F');
  doc.setFontSize(8);
  doc.text('Cost Category', 18, y);
  doc.text('Amount (Rs.)', 120, y);
  doc.text('Share (%)', 165, y);
  y += 6;

  data.expenses.forEach((item) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'normal');
    doc.text(item.category_name, 18, y);
    doc.text(`Rs. ${Math.round(item.cost).toLocaleString('en-IN')}`, 120, y);
    doc.text(`${item.percentage.toFixed(1)}%`, 165, y);
    doc.line(14, y + 2, 196, y + 2);
    y += 6;
  });

  // Disclaimer Footer
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Notice: All calculations are Estimates generated for decision support based on regional benchmarks and weather forecasts. Consult local KVK / TNAU / ICAR.',
    14,
    285
  );

  doc.save(`AgriSmart_Plan_${data.cropName.replace(/\s+/g, '_')}.pdf`);
}
