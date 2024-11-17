import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import IncomeIssuesJson from './Issues.json';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DomesticViolenceDoughnutChart = () => {
  const domesticViolenceData = IncomeIssuesJson?.domestic_violence || [];
  const domesticViolencePercentage = domesticViolenceData.map(item => {
    const survivorCount = item?.["Survivor of domestic violence"];
    const totalAttended = item?.["total_attended"];
    return survivorCount && totalAttended ? ((survivorCount / totalAttended) * 100).toFixed(2) : "0";
  });

  const chartData = {
    labels: domesticViolenceData.map(item => item.Salary),
    datasets: [
      {
        label: 'Domestic Violence Survivor Percentage (%)',
        data: domesticViolencePercentage,
        backgroundColor: ['#3182CE', '#4FD1C5', '#68D391', '#9AE6B4', '#81E6D9'],
        borderColor: '#2B6CB0',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Domestic Violence Survivor Percentage by Salary',
        color: '#2D3748',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const salary = domesticViolenceData[index]?.Salary;
            const percentage = domesticViolencePercentage[index];
            const total = domesticViolenceData[index]?.total_attended;
            return `${salary}: ${percentage}% of ${total} responses`;
          }
        }
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-700">Salary Analysis - Domestic Violence Survivor Percentage</h2>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DomesticViolenceDoughnutChart;
