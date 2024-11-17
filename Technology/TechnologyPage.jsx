import React, { useEffect, useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Importing the JSON files directly
import jsonData from "./Barchart2.json";
import chartData from "./Barchart.json";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CombinedBarChart = () => {
  // First chart data state
  const [firstChartData, setFirstChartData] = useState(null);
  const backgroundColors = [
    "rgb(224, 70, 31)",
    "rgb(101, 25, 11)",
    "rgb(134, 37, 15)",
    "rgb(223, 107, 79)",
  ];

  const [firstChartOptions, setFirstChartOptions] = useState(null); // <-- Define this here

  useEffect(() => {
    const labels = Object.keys(chartData);
    const counts = labels.map((label) => chartData[label].count);

    // Calculate the total count of people
    const totalPeople = counts.reduce((sum, count) => sum + count, 0);

    // Calculate percentages
    const percentages = counts.map((count) => (count / totalPeople) * 100);

    // Calculate dynamic step size for y-axis based on max percentage
    const maxPercentage = Math.max(...percentages);
    const stepSize = Math.ceil(maxPercentage / 10) * 10;

    setFirstChartData({
      labels: labels,
      datasets: [
        {
          label: "Percentage (%)",
          data: percentages,
          backgroundColor: backgroundColors,
          countData: counts,
        },
      ],
    });

    // Define firstChartOptions here
    setFirstChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          font: { size: 20, weight: "bold", family: "'Arial', sans-serif" },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const count = tooltipItem.dataset.countData[tooltipItem.dataIndex];
              const percentage = tooltipItem.raw.toFixed(2);
              const totalPeople = tooltipItem.dataset.countData.reduce((sum, val) => sum + val, 0);
              return `Count: ${count}, Percentage: ${percentage}% From Total ${totalPeople}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: "Amount Range", color: "#e8461e", font: { size: 13, weight: "bold" } },
        },
        y: {
          title: { display: true, text: "Percentage Of People", color: "#e8461e", font: { size: 13, weight: "bold" } },
          beginAtZero: true,
          min:0,
          max:50,
          ticks: { stepSize: 10 },
        },
      },
    });
  }, []); // Empty dependency array means this effect runs only once, after the initial render

  // Second chart data state
  const [secondChartData, setSecondChartData] = useState(null);

  useEffect(() => {
    // Transforming the imported JSON into an array of objects
    const transformedData = Object.entries(jsonData).map(([key, value]) => ({
      label: key,
      value,
    }));

    // Calculate the total value for percentage calculation
    const totalValue = transformedData.reduce((sum, item) => sum + item.value, 0);

    // Calculate percentages based on the total value
    const percentages = transformedData.map(item => (item.value / totalValue) * 100);

    // Calculate dynamic bar colors based on the index
    const barColorArray = transformedData.map(
      (_, index) => backgroundColors[index % backgroundColors.length]
    );

    setSecondChartData({
      labels: transformedData.map((item) => item.label),
      datasets: [
        {
          label: "Skills Data",
          data: percentages,
          backgroundColor: barColorArray,
          valueData: transformedData.map(item => item.value),
        },
      ],
    });
  }, []);

  // Dynamically calculate the step size for the y-axis
  const secondChartOptions = useMemo(() => {
    const maxPercentage = secondChartData
      ? Math.max(...secondChartData.datasets[0].data)
      : 0;
    const stepSize = Math.ceil(maxPercentage / 10) * 10;

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Total Number Of People (117)",
          font: {
            size: 20,
            weight: "bold",
            family: "'Arial', sans-serif",
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const value = tooltipItem.dataset.valueData[tooltipItem.dataIndex];
              const percentage = tooltipItem.raw.toFixed(2);
              const totalValue = tooltipItem.dataset.valueData.reduce((sum, val) => sum + val, 0);
              return `Value: ${value}, Percentage: ${percentage}% From Total ${totalValue}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Categories",
            color: "#e8461e",
            font: { size: 16, weight: "bold" },
          },
        },
        y: {
          title: {
            display: true,
            text: "Percentage Of People",
            color: "#e8461e",
            font: { size: 13, weight: "bold" },
          },
          beginAtZero: true,
          min:0,
          max:50,
          ticks: { stepSize: 10 },
        },
      },
    };
  }, [secondChartData]);

  if (!firstChartData || !firstChartOptions || !secondChartData) return <div>Loading...</div>;

  return (
    <div className="bg-[#3c3950] min-h-screen font-lato">
      <div className="bg-[#212331] text-white py-8 px-4 max-md:px-0">
        <div className="flex text-2xl md:text-4xl p-4">
          <h1 className="text-yellow-400">
            Protsahan - For a Better Future | Data Visualization
          </h1>
        </div>
        <div className="bg-[#3c3950] rounded-lg shadow-lg pt-4">
          <div className="border-[2px] border-dashed border-white rounded-md p-5 m-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
              <div className="text-white">
                <span className="text-[#e8461e] mr-2">Timeline:</span>
                Child entering Protsahan
              </div>
              <div className="flex flex-wrap justify-center">
                <p className="text-white text-center">
                  <span className="text-[#e8461e] mr-2">
                    Potential Consumers:
                  </span>
                  Protsahan Executive Team | Governmental Bodies
                </p>
              </div>
            </div>
            <div className="text-center p-4 text-white">
              <p>
                These set of data visualisations paints a story of the enrolment
                data of students on a specified date range/month/year. It tells
                the user how many children have enrolled in Protsahan, basic
                data related to the pool of children, etc.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-6 p-5 bg-[#dcdcdc] max-md:flex-col">
            <div className="w-1/2 max-md:w-full h-[75vh] bg-white p-5 flex justify-center items-center flex-col shadow-md rounded-lg">
              <h2 className="text-[18px] font-bold text-center mb-4 text-[#e8461e]">
                Income Data Overview
              </h2>
              <div className="w-full max-md:h-[75vh] h-full">
                <Bar data={firstChartData} options={firstChartOptions} />
              </div>
            </div>
            <div className="w-1/2 max-md:w-full h-[75vh] bg-white p-5 flex justify-center items-center flex-col shadow-md rounded-lg">
              <h2 className="text-[18px] font-bold text-center mb-4 text-[#e8461e]">
                Skills Acquired Through Our NGO’s Support
              </h2>
              <div className="w-full max-md:h-[70vh] h-full">
                <Bar data={secondChartData} options={secondChartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinedBarChart;
