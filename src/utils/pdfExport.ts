// src/utils/pdfExport.ts

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

interface TestResult {
  id: string;
  test_date: string;
  player_id: string;
  long_jump_m: number | null;
  ten_m_sprint_s: number | null;
  twenty_m_sprint_s: number | null;
  forty_m_sprint_s: number | null;
  run_a_three_s: number | null;
  yo_yo_test_level: number | null;
  players: { name: string } | null;
}

export const exportToPDF = (
  testResults: TestResult[],
  teamName: string,
  testDate: string
) => {
  // Create new PDF document
  const doc = new jsPDF('landscape'); // Use landscape for better table fit
  
  // Set document properties
  doc.setProperties({
    title: `Fitness Test Results - ${teamName}`,
    subject: 'Fitness Test Report',
    author: 'Fitness Test System',
    creator: 'Fitness Test System'
  });

  // Add title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Fitness Test Results', 20, 20);

  // Add team name and date
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Team: ${teamName}`, 20, 35);
  
  // Format date for display
  const formattedDate = new Date(testDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Test Date: ${formattedDate}`, 20, 45);
  doc.text(`Total Players: ${testResults.length}`, 20, 55);

  // Prepare table data
  const tableColumns = [
    'Player Name',
    'Long Jump (m)',
    '10m Sprint (s)',
    '20m Sprint (s)',
    '40m Sprint (s)',
    'Run A Three (s)',
    'YoYo Test (level)'
  ];

  const tableRows = testResults.map(result => [
    result.players?.name || 'Unknown Player',
    result.long_jump_m?.toString() || '-',
    result.ten_m_sprint_s?.toString() || '-',
    result.twenty_m_sprint_s?.toString() || '-',
    result.forty_m_sprint_s?.toString() || '-',
    result.run_a_three_s?.toString() || '-',
    result.yo_yo_test_level?.toString() || '-'
  ]);

  // Add table using autoTable
  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: 65,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 139, 202], // Blue color
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9,
      textColor: 50
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 40 }, // Player name column wider
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 25, halign: 'center' },
      6: { cellWidth: 30, halign: 'center' }
    },
    margin: { left: 20, right: 20 },
    tableWidth: 'auto'
  });

  // Add footer with generation timestamp
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      20,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }

  // Generate filename
  const sanitizedTeamName = teamName.replace(/[^a-z0-9]/gi, '_');
  const sanitizedDate = testDate.replace(/[^0-9]/g, '_');
  const filename = `Fitness_Test_Results_${sanitizedTeamName}_${sanitizedDate}.pdf`;

  // Save the PDF
  doc.save(filename);
};