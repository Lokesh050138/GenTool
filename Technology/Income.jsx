import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { IoMdArrowRoundBack } from "react-icons/io";
import data from "./Inocme.json"; // Ensure path is correct for the provided JSON

const ChartComponent = () => {
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [selectedSalaryData, setSelectedSalaryData] = useState(null);
  const [showCategoryChart, setShowCategoryChart] = useState(false);

  const totalResponses = data.reduce((acc, item) => acc + item.total_ans, 0);

  const salaryData = data.map((item) => ({
    salary: item.salary,
    total: item.total_ans,
  }));

  const handleSalaryClick = (salary) => {
    const salaryDetails = data.find((item) => item.salary === salary);
    setSelectedSalary(salary);
    setSelectedSalaryData(salaryDetails.options);
    setShowCategoryChart(true);
  };

  const handleBackToSalaryChart = () => {
    setShowCategoryChart(false);
    setTimeout(() => {
      setSelectedSalary(null);
      setSelectedSalaryData(null);
    }, 500); // Delay for smooth transition
  };

  const totalChartData = {
    labels: salaryData.map((item) => item.salary),
    datasets: [
      {
        label: "Total Answers (%)",
        data: salaryData.map((item) =>
          ((item.total / totalResponses) * 100).toFixed(2)
        ),
        backgroundColor: [
          "rgb(224, 70, 31)",
          "rgb(101, 25, 11)",
          "rgb(134, 37, 15)",
          "#121331",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex justify-center py-10 px-4 bg-[#dcdcdc]">
      <div className="container h-[85vh] mx-auto p-4 bg-white shadow-lg rounded-lg max-w-6xl">
        <div className="flex justify-start p-4">
          {showCategoryChart && (
            <button
              className="transition-button"
              onClick={handleBackToSalaryChart}
            >
              <IoMdArrowRoundBack className="text-white text-2xl hover:text-gray-300" />
            </button>
          )}
        </div>
        <h1 className="text-2xl font-bold text-[#212331] text-center mb-4">
          Salary Data Visualization
        </h1>
        <div className="chart-wrapper">
          <div
            className={`chart-container ${
              showCategoryChart ? "slide-out-left" : "slide-in-left"
            }`}
            style={{ display: showCategoryChart ? "none" : "block" }}
          >
            {!showCategoryChart && (
              <>
                <Bar
                  data={totalChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    onClick: (event, elements) => {
                      if (elements.length > 0) {
                        const salary = salaryData[elements[0].index].salary;
                        handleSalaryClick(salary);
                      }
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const salary = salaryData[context.dataIndex].salary;
                            const total = salaryData[context.dataIndex].total;
                            const percentage = (
                              (total / totalResponses) *
                              100
                            ).toFixed(2);
                            return `${salary}: ${percentage}% (${total} responses) from the total 180`;
                          },
                        },
                      },
                    },
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: "Salary Ranges →",
                          color: "#e0461f",
                        },
                      },
                      y: {
                        title: {
                          display: true,
                          text: "Total Answers →",
                          color: "#e0461f",
                        },
                      },
                    },
                  }}
                />
                <div className="text-center text-[#e0461f] mt-4 text-lg font-semibold">
                  Click on any bar to see the issues people face
                </div>
              </>
            )}
          </div>
          <div
            className={`chart-container-sec ${
              showCategoryChart ? "slide-in-right" : "slide-out-right"
            }`}
            style={{ display: showCategoryChart ? "block" : "none" }}
          >
            {showCategoryChart && selectedSalaryData && (
              <Bar
                data={{
                  labels: Object.keys(selectedSalaryData),
                  datasets: [
                    {
                      label: `Options Distribution for ${selectedSalary}`,
                      data: Object.values(selectedSalaryData),
                      backgroundColor: "rgba(153, 102, 255, 0.6)",
                      borderColor: "rgba(153, 102, 255, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label;
                          const value = context.raw;
                          return `${label}: ${value} responses`;
                        },
                      },
                    },
                  },
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: "Categories →",
                        color: "#9966ff",
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Answer Distribution →",
                        color: "#9966ff",
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
      <style>{`
        .chart-wrapper {
          position: relative;
          width: 100%;
          height: 70vh;
          overflow: hidden;
        }

        .chart-container, .chart-container-sec {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 62vh;
          transition: transform 0.5s ease, opacity 0.5s ease;
          opacity: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide-in-left { transform: translateX(0); opacity: 1; }
        .slide-out-left { transform: translateX(-100%); opacity: 0; }
        .slide-in-right { transform: translateX(0); opacity: 1; }
        .slide-out-right { transform: translateX(100%); opacity: 0; }

        .transition-button {
          background: linear-gradient(to right, #333, #555);
          padding: 0.75rem;
          border-radius: 50%;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .transition-button:hover {
          transform: scale(1.15);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ChartComponent;
