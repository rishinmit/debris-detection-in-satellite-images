import jsPDF from 'jspdf';
import { CLASS_INTERPRETATIONS, formatPercent } from './analysis';

export const generateReport = (data, topPrediction, riskLevel, modelAgreement) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Satellite Image Analysis Report', 20, 20);
  
  // Timestamp
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  const timestamp = new Date().toLocaleString();
  doc.text(`Generated: ${timestamp}`, 20, 30);
  
  // Divider
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Top Prediction
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Primary Detection', 20, 45);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(`Class: ${topPrediction.label}`, 25, 52);
  doc.text(`Confidence: ${formatPercent(topPrediction.confidence)}`, 25, 59);
  doc.text(`Risk Level: ${riskLevel.level}`, 25, 66);
  doc.text(`Description: ${topPrediction.interpretation.description}`, 25, 73);
  
  // All Predictions
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Complete Classification', 20, 85);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  let yPos = 92;
  Object.entries(data.ensemble).forEach(([className, confidence]) => {
    const classInfo = CLASS_INTERPRETATIONS[className];
    doc.text(`${classInfo?.label || className}: ${formatPercent(confidence)}`, 25, yPos);
    yPos += 6;
  });
  
  // Model Agreement
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Model Agreement Analysis', 20, yPos + 10);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Agreement Level: ${modelAgreement.level}`, 25, yPos + 17);
  doc.text(`Score: ${(modelAgreement.score * 100).toFixed(1)}%`, 25, yPos + 24);
  doc.text(modelAgreement.description, 25, yPos + 31);
  
  // Metadata
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Image Metadata', 20, yPos + 45);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Dimensions: ${data.metadata.width} x ${data.metadata.height} px`, 25, yPos + 52);
  doc.text(`Format: ${data.metadata.format}`, 25, yPos + 59);
  doc.text(`Processing Time: ${data.time.toFixed(3)} seconds`, 25, yPos + 66);
  
  // Alert Notice
  if (data.ensemble.marine_debris > 0.6) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 71, 87);
    doc.text('⚠ ALERT: High marine pollution detected', 20, yPos + 80);
    doc.setTextColor(0, 0, 0);
  }
  
  // Footer
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text('Debris Detection System - AI-Powered Satellite Image Analysis', 20, 280);
  
  // Save
  const filename = `debris-report-${Date.now()}.pdf`;
  doc.save(filename);
  
  return filename;
};
