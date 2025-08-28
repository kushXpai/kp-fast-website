// src/utils/pdfExport.ts

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Chart from 'chart.js/auto';

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

// Helper function to create chart and return as image
const createChartImage = async (
  type: 'bar' | 'line',
  labels: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datasets: any[],
  title: string,
  width = 1600,
  height = 900
): Promise<string> => {
  return new Promise((resolve) => {
    // Create a temporary canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve('');
      return;
    }

    console.log(`Creating chart with ${labels.length} labels:`, title);

    // Truncate long labels for better display
    const truncatedLabels = labels.map(label => 
      label.length > 10 ? label.substring(0, 10) + '.' : label
    );

    // Create chart
    const chart = new Chart(ctx, {
      type: type,
      data: {
        labels: truncatedLabels,
        datasets: datasets
      },
      options: {
        responsive: false,
        animation: false,
        devicePixelRatio: 2,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 28,
              weight: 'bold'
            },
            padding: 40
          },
          legend: {
            display: false,
            position: 'top',
            labels: {
              font: {
                size: 18
              },
              padding: 25
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#e5e7eb',
              lineWidth: 1
            },
            ticks: {
              font: {
                size: 16
              }
            },
            title: {
              display: true,
              text: datasets[0]?.label || 'Value',
              font: {
                size: 20,
                weight: 'bold'
              }
            }
          },
          x: {
            grid: {
              display: false,
              color: '#e5e7eb',
              lineWidth: 1
            },
            ticks: {
              font: {
                size: labels.length > 25 ? 10 : labels.length > 20 ? 12 : 14
              },
              maxRotation: 90,
              minRotation: 90,
              callback: function(value, index) {
                return truncatedLabels[index];
              }
            },
            title: {
              display: true,
              text: `All ${labels.length} Players`,
              font: {
                size: 20,
                weight: 'bold'
              }
            }
          }
        },
        layout: {
          padding: {
            left: 60,
            right: 60,
            top: 60,
            bottom: 80
          }
        },
        elements: {
          bar: {
            borderWidth: 2
          }
        }
      }
    });

    // Wait for chart to render, then convert to image
    setTimeout(() => {
      const imageData = canvas.toDataURL('image/png', 1.0);
      chart.destroy();
      canvas.remove();
      console.log(`Chart created successfully: ${title}`);
      resolve(imageData);
    }, 2500);
  });
};

// Calculate statistics
const calculateStats = (values: (number | null)[]): {
  min: number;
  max: number;
  avg: number;
  count: number;
} => {
  const validValues = values.filter(v => v !== null) as number[];
  if (validValues.length === 0) {
    return { min: 0, max: 0, avg: 0, count: 0 };
  }
  
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  const avg = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  
  return { min, max, avg: Math.round(avg * 100) / 100, count: validValues.length };
};

export const exportToPDF = async (
  testResults: TestResult[],
  teamName: string,
  testDate: string
) => {
  // Create new PDF document
  const doc = new jsPDF('landscape');
  
  // Set document properties
  doc.setProperties({
    title: `Fitness Test Results - ${teamName}`,
    subject: 'Fitness Test Report',
    author: 'Fitness Test System',
    creator: 'Fitness Test System'
  });

  // Add title page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Fitness Test Results', 20, 30);

  // Add team name and date
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(`Team: ${teamName}`, 20, 50);
  
  const formattedDate = new Date(testDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Test Date: ${formattedDate}`, 20, 65);
  doc.text(`Total Players: ${testResults.length}`, 20, 80);

  // PAGE 1: Detailed Results Table
  doc.addPage();
  let currentY = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Test Results', 20, currentY);
  currentY += 15;

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

  autoTable(doc, {
    head: [tableColumns],
    body: tableRows,
    startY: currentY,
    theme: 'striped',
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 11
    },
    bodyStyles: {
      fontSize: 9,
      textColor: 50
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    columnStyles: {
      0: { cellWidth: 45 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 30, halign: 'center' },
      4: { cellWidth: 30, halign: 'center' },
      5: { cellWidth: 30, halign: 'center' },
      6: { cellWidth: 30, halign: 'center' }
    },
    margin: { left: 20, right: 20 }
  });

  // PAGE 2: Statistics
  doc.addPage();
  currentY = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Performance Statistics', 20, currentY);
  currentY += 20;

  const stats = [
    { name: '10m Sprint (s)', ...calculateStats(testResults.map(r => r.ten_m_sprint_s)) },
    { name: '20m Sprint (s)', ...calculateStats(testResults.map(r => r.twenty_m_sprint_s)) },
    { name: '40m Sprint (s)', ...calculateStats(testResults.map(r => r.forty_m_sprint_s)) },
    { name: 'Run A Three (s)', ...calculateStats(testResults.map(r => r.run_a_three_s)) },
    { name: 'YoYo Test (level)', ...calculateStats(testResults.map(r => r.yo_yo_test_level)) },
    { name: 'Long Jump (m)', ...calculateStats(testResults.map(r => r.long_jump_m)) }
  ];

  // Statistics table
  autoTable(doc, {
    head: [['Test', 'Participants', 'Minimum', 'Maximum', 'Average']],
    body: stats.map(stat => [
      stat.name,
      stat.count.toString(),
      stat.min.toString(),
      stat.max.toString(),
      stat.avg.toString()
    ]),
    startY: currentY,
    theme: 'grid',
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 12
    },
    bodyStyles: {
      fontSize: 11
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 35, halign: 'center' },
      3: { cellWidth: 35, halign: 'center' },
      4: { cellWidth: 35, halign: 'center' }
    }
  });

  // Prepare data for charts
  const playerNames = testResults.map(r => r.players?.name || 'Unknown');
  const allResults = testResults;

  console.log(`Creating charts for ${testResults.length} players:`, playerNames);

  // Chart colors
  const colors = {
    longJump: '#3B82F6',
    sprint10m: '#EF4444',
    sprint20m: '#F59E0B',
    sprint40m: '#10B981',
    runAThree: '#8B5CF6',
    yoYo: '#F97316'
  };

  try {
    // CHART 1: 10m Sprint (Page 3)
    doc.addPage();
    const sprint10Chart = await createChartImage(
      'bar',
      playerNames,
      [
        {
          label: '10m Sprint (s)',
          data: allResults.map(r => r.ten_m_sprint_s || 0),
          backgroundColor: colors.sprint10m + '80',
          borderColor: colors.sprint10m,
          borderWidth: 2
        }
      ],
      `10m Sprint Performance - All ${allResults.length} Players`
    );

    if (sprint10Chart) {
      // Full page chart
      const chartWidth = 250;
      const chartHeight = 160;
      const centerX = (doc.internal.pageSize.width - chartWidth) / 2;
      const centerY = 30;
      doc.addImage(sprint10Chart, 'PNG', centerX, centerY, chartWidth, chartHeight);
    }

    // CHART 2: 20m Sprint (Page 4)
    doc.addPage();
    const sprint20Chart = await createChartImage(
      'bar',
      playerNames,
      [
        {
          label: '20m Sprint (s)',
          data: allResults.map(r => r.twenty_m_sprint_s || 0),
          backgroundColor: colors.sprint20m + '80',
          borderColor: colors.sprint20m,
          borderWidth: 2
        }
      ],
      `20m Sprint Performance - All ${allResults.length} Players`
    );

    if (sprint20Chart) {
      const chartWidth = 250;
      const chartHeight = 160;
      const centerX = (doc.internal.pageSize.width - chartWidth) / 2;
      const centerY = 30;
      doc.addImage(sprint20Chart, 'PNG', centerX, centerY, chartWidth, chartHeight);
    }

    // CHART 3: 40m Sprint (Page 5)
    doc.addPage();
    const sprint40Chart = await createChartImage(
      'bar',
      playerNames,
      [
        {
          label: '40m Sprint (s)',
          data: allResults.map(r => r.forty_m_sprint_s || 0),
          backgroundColor: colors.sprint40m + '80',
          borderColor: colors.sprint40m,
          borderWidth: 2
        }
      ],
      `40m Sprint Performance - All ${allResults.length} Players`
    );

    if (sprint40Chart) {
      const chartWidth = 250;
      const chartHeight = 160;
      const centerX = (doc.internal.pageSize.width - chartWidth) / 2;
      const centerY = 30;
      doc.addImage(sprint40Chart, 'PNG', centerX, centerY, chartWidth, chartHeight);
    }

    // CHART 4: Run A Three (Page 6)
    doc.addPage();
    const runAThreeChart = await createChartImage(
      'bar',
      playerNames,
      [
        {
          label: 'Run A Three (s)',
          data: allResults.map(r => r.run_a_three_s || 0),
          backgroundColor: colors.runAThree + '80',
          borderColor: colors.runAThree,
          borderWidth: 2
        }
      ],
      `Run A Three Performance - All ${allResults.length} Players`
    );

    if (runAThreeChart) {
      const chartWidth = 250;
      const chartHeight = 160;
      const centerX = (doc.internal.pageSize.width - chartWidth) / 2;
      const centerY = 30;
      doc.addImage(runAThreeChart, 'PNG', centerX, centerY, chartWidth, chartHeight);
    }

    // CHART 5: YoYo Test (Page 7)
    doc.addPage();
    const yoyoChart = await createChartImage(
      'bar',
      playerNames,
      [
        {
          label: 'YoYo Test (level)',
          data: allResults.map(r => r.yo_yo_test_level || 0),
          backgroundColor: colors.yoYo + '80',
          borderColor: colors.yoYo,
          borderWidth: 2
        }
      ],
      `YoYo Test Performance - All ${allResults.length} Players`
    );

    if (yoyoChart) {
      const chartWidth = 250;
      const chartHeight = 160;
      const centerX = (doc.internal.pageSize.width - chartWidth) / 2;
      const centerY = 30;
      doc.addImage(yoyoChart, 'PNG', centerX, centerY, chartWidth, chartHeight);
    }

    // CHART 6: Long Jump (Last Page - Page 8)
    doc.addPage();
    const longJumpChart = await createChartImage(
      'bar',
      playerNames,
      [
        {
          label: 'Long Jump (m)',
          data: allResults.map(r => r.long_jump_m || 0),
          backgroundColor: colors.longJump + '80',
          borderColor: colors.longJump,
          borderWidth: 2
        }
      ],
      `Long Jump Performance - All ${allResults.length} Players`
    );

    if (longJumpChart) {
      const chartWidth = 250;
      const chartHeight = 160;
      const centerX = (doc.internal.pageSize.width - chartWidth) / 2;
      const centerY = 30;
      doc.addImage(longJumpChart, 'PNG', centerX, centerY, chartWidth, chartHeight);
    }

  } catch (error) {
    console.error('Error creating charts:', error);
  }

  // Add footer with generation timestamp to all pages
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