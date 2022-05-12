import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

import Banner from "../components/Banner";
import Loading from "../components/Loading";

import { useNotif } from "../context/NotificationContext";

export default function Chart() {
  const { handleNotif } = useNotif();
  const navigate = useNavigate();
  const location = useLocation();
  const exercise = location.state.exercise;

  const [loading, setLoading] = useState(false);
  const [fetchedLogs, setFetchedLogs] = useState([]);
  const [chartLogs, setChartLogs] = useState([]);
  const [showWeight, setShowWeight] = useState(true);

  const createChartLogs = list => {
    const logs = [...list];
    let newData = logs.slice(0).reverse().map( exercise => {
      let date = new Date(exercise.date);
      let formattedDate = date.toString().slice(4, 10);
      if (showWeight) {
        return {x: formattedDate, y: exercise.weight};
      } else {
        return {x: formattedDate, y: exercise.maxRep};
      }
    });
    setChartLogs(newData);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          borderColor: "rgba(71, 85, 105, 0.5)",
          borderWidth: 2,
          color: "rgba(71, 85, 105, 0.5)",
        },
        ticks: {
          maxRotation: 60,
          minRotation: 60,
          font: {
            size: 16,
            family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            weight: "bold"
          },
          padding: 6
        }
      },
      y: {
        grid: {
          borderColor: "rgba(71, 85, 105, 0.5)",
          borderWidth: 2,
          color: "rgba(71, 85, 105, 0.5)",
        },
        ticks: {
          stepSize: 5,
          font: {
            size: 16,
            family: "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'",
            weight: "bold"
          },
          padding: 6,
          generateTickLabels( ticks ) {
            ticks[ticks.length - 1] = null;
          }
        },
        grace: "10%",
        skip: 5,
      },
    },
    layout: {
      padding: 0
    }
  };

  const chartData = {
    datasets: [
      {
        data: chartLogs,
        borderColor: "#fbbf24",
        pointBackgroundColor: "#fbbf24",
        backgroundColor: "rgba(251, 191, 36, 0.2)",
        fill: true,
        pointHitRadius: 10,
      }
    ]
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/log/exercise/${exercise._id}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });

      const data = await res.json();
      if (data.result === "success") {
        setFetchedLogs(data.data);
        createChartLogs(data.data);
      }
      if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightClick = ()  => {
    setShowWeight(true);
  };

  const handle1RMClick = ()  => {
    setShowWeight(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    createChartLogs(fetchedLogs);
  }, [showWeight]);

  return (
    <>
      <Banner
        bannerText={exercise.name}
        showBack={true}
      />
      {
        loading
          ? <Loading text="Looking through your gains..." />
          : <div className="h-[90vh] p-6">
            <div className="h-[50vh] mb-6">
              <Line 
                data={chartData}
                options={chartOptions}
              />
            </div>
            <div className="flex flex-col justify-start items-center w-full">
              <button 
                onClick={() => handleWeightClick()} 
                className={`w-full btn-lg mb-4 ${showWeight ? "btn-lg" : "btn-inactive-lg"}`}
              >Weight</button>
              <button  
                onClick={() => handle1RMClick()}
                className={`w-full btn-lg mb-4 ${!showWeight ? "btn-lg" : "btn-inverted-lg"}`}
              >1 Rep Max</button>
            </div>
          </div>
      }
    </>
  );
}