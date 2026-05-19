import jsPDF from 'jspdf';
import { CLASS_INTERPRETATIONS, formatPercent } from './analysis';

export const generateReport = (data, topPrediction, riskLevel, modelAgreement, previewBase64) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const footerY = pageHeight - 10;

  let yPos = 18;

  // ─────────────────────────────────────────────
  // HEADER
  // ─────────────────────────────────────────────

  const drawHeader = () => {
    doc.setFillColor(17, 24, 39);

    doc.roundedRect(
      margin,
      10,
      contentWidth,
      26,
      2,
      2,
      'F'
    );

    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(255, 255, 255);

    doc.text(
      'Satellite Image Analysis Report',
      margin + 4,
      22
    );

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(209, 213, 219);

    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      margin + 4,
      29
    );

    doc.setTextColor(17, 24, 39);

    yPos = 44;
  };

  // ─────────────────────────────────────────────
  // PAGE BREAK HANDLER
  // ─────────────────────────────────────────────

  const ensureSpace = (requiredHeight) => {
    if (yPos + requiredHeight <= footerY - 4) return;

    doc.addPage();
    yPos = 18;
  };

  // ─────────────────────────────────────────────
  // SECTION TITLE
  // ─────────────────────────────────────────────

  const drawSectionTitle = (title) => {
    ensureSpace(14);

    doc.setFillColor(241, 245, 249);

    doc.roundedRect(
      margin,
      yPos - 5,
      contentWidth,
      8,
      1.5,
      1.5,
      'F'
    );

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(31, 41, 55);

    doc.text(title, margin + 3, yPos);

    // Increased section spacing
    yPos += 13;
  };

  // ─────────────────────────────────────────────
  // LABEL + VALUE TEXT
  // ─────────────────────────────────────────────

  const drawLabeledText = (label, value) => {
    doc.setFontSize(10);

    doc.setFont(undefined, 'bold');
    doc.setTextColor(17, 24, 39);

    doc.text(`${label}:`, margin + 2, yPos);

    doc.setFont(undefined, 'normal');
    doc.setTextColor(55, 65, 81);

    const valueX = margin + 34;

    const wrapped = doc.splitTextToSize(
      String(value),
      contentWidth - 38
    );

    doc.text(
      wrapped,
      valueX,
      yPos,
      {
        lineHeightFactor: 1.5
      }
    );

    // Increased row spacing
    yPos += Math.max(10, wrapped.length * 7);
  };

  // ─────────────────────────────────────────────
  // METRIC CARDS
  // ─────────────────────────────────────────────

  const drawMetricCards = () => {
    ensureSpace(22);

    const gap = 4;
    const cardWidth = (contentWidth - gap * 2) / 3;

    const cardTop = yPos;
    const cardHeight = 15;

    const cards = [
      {
        title: 'Primary Class',
        value: topPrediction.label
      },
      {
        title: 'Confidence',
        value: formatPercent(topPrediction.confidence)
      },
      {
        title: 'Risk Level',
        value: riskLevel.level
      }
    ];

    cards.forEach((card, index) => {
      const x = margin + index * (cardWidth + gap);

      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);

      doc.roundedRect(
        x,
        cardTop,
        cardWidth,
        cardHeight,
        1.5,
        1.5,
        'FD'
      );

      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 116, 139);

      doc.text(
        card.title,
        x + 2.5,
        cardTop + 5
      );

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(15, 23, 42);

      doc.text(
        String(card.value),
        x + 2.5,
        cardTop + 11
      );
    });

    // Increased spacing after cards
    yPos += cardHeight + 16;
  };

  // ─────────────────────────────────────────────
  // ANALYZED IMAGE
  // ─────────────────────────────────────────────

  const drawAnalyzedImage = () => {
    if (!previewBase64) return;

    drawSectionTitle('Analyzed Image');

    ensureSpace(80);

    const imageDataUrl = `data:image/png;base64,${previewBase64}`;

    const frameX = margin;
    const frameY = yPos - 1;

    const frameWidth = contentWidth;
    const frameHeight = 66;

    const maxImageWidth = frameWidth - 6;
    const maxImageHeight = frameHeight - 6;

    const sourceWidth = data?.metadata?.width || 1;
    const sourceHeight = data?.metadata?.height || 1;

    const ratio = Math.min(
      maxImageWidth / sourceWidth,
      maxImageHeight / sourceHeight
    );

    const renderWidth = sourceWidth * ratio;
    const renderHeight = sourceHeight * ratio;

    const imageX =
      frameX + (frameWidth - renderWidth) / 2;

    const imageY =
      frameY + (frameHeight - renderHeight) / 2;

    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);

    doc.roundedRect(
      frameX,
      frameY,
      frameWidth,
      frameHeight,
      2,
      2,
      'FD'
    );

    try {
      doc.addImage(
        imageDataUrl,
        'PNG',
        imageX,
        imageY,
        renderWidth,
        renderHeight,
        undefined,
        'FAST'
      );
    } catch (error) {
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);

      doc.text(
        'Image preview unavailable for this report.',
        frameX + 4,
        frameY + 8
      );
    }

    // Increased spacing after image
    yPos += frameHeight + 15;
  };

  // ─────────────────────────────────────────────
  // BUILD REPORT
  // ─────────────────────────────────────────────

  drawHeader();

  drawMetricCards();

  drawAnalyzedImage();

  // PRIMARY DETECTION

  drawSectionTitle('Primary Detection');

  drawLabeledText('Class', topPrediction.label);

  drawLabeledText(
    'Confidence',
    formatPercent(topPrediction.confidence)
  );

  drawLabeledText(
    'Risk',
    riskLevel.level
  );

  drawLabeledText(
    'Description',
    topPrediction.interpretation.description
  );

  // COMPLETE CLASSIFICATION

  drawSectionTitle('Complete Classification');

  Object.entries(data.ensemble)
    .sort((a, b) => b[1] - a[1])
    .forEach(([className, confidence]) => {

      ensureSpace(10);

      const classInfo =
        CLASS_INTERPRETATIONS[className];

      const label =
        classInfo?.label || className;

      const confidencePct =
        formatPercent(confidence);

      doc.setFontSize(10);

      doc.setFont(undefined, 'normal');
      doc.setTextColor(31, 41, 55);

      doc.text(
        label,
        margin + 2,
        yPos
      );

      doc.setFont(undefined, 'bold');
      doc.setTextColor(15, 23, 42);

      doc.text(
        confidencePct,
        pageWidth - margin - doc.getTextWidth(confidencePct),
        yPos
      );

      // Increased spacing
      yPos += 10;
    });

  // MODEL AGREEMENT

  drawSectionTitle('Model Agreement Analysis');

  drawLabeledText(
    'Agreement Level',
    modelAgreement.level
  );

  drawLabeledText(
    'Score',
    `${(modelAgreement.score * 100).toFixed(1)}%`
  );

  drawLabeledText(
    'Summary',
    modelAgreement.description
  );

  // METADATA

  drawSectionTitle('Image Metadata');

  drawLabeledText(
    'Dimensions',
    `${data.metadata.width} x ${data.metadata.height} px`
  );

  drawLabeledText(
    'Format',
    data.metadata.format
  );

  drawLabeledText(
    'Processing Time',
    `${data.time.toFixed(3)} seconds`
  );

  // WARNING BOX

  if ((data.ensemble?.marine_debris || 0) > 0.6) {

    ensureSpace(18);

    doc.setDrawColor(239, 68, 68);
    doc.setFillColor(254, 242, 242);

    doc.roundedRect(
      margin,
      yPos - 2,
      contentWidth,
      10,
      1.5,
      1.5,
      'FD'
    );

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(185, 28, 28);

    doc.text(
      'High marine pollution detected. Immediate review recommended.',
      margin + 3,
      yPos + 4
    );

    yPos += 16;
  }

  // FOOTER

  doc.setFontSize(8);

  doc.setFont(undefined, 'italic');

  doc.setTextColor(107, 114, 128);

  yPos += 14;

  doc.text(
    'Debris Detection System - AI-Powered Satellite Image Analysis',
    margin,
    footerY
  );

  // SAVE PDF

  const filename = `debris-report-${Date.now()}.pdf`;

  doc.save(filename);

  return filename;
};