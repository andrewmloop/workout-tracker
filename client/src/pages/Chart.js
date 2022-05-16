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
  const [chartDates, setChartDates] = useState([]);
  const [showWeight, setShowWeight] = useState(true);
  const [showMax, setShowMax] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const createChartLogs = list => {
    // const logs = [...list];
    // let newData = logs.slice(0).map( exercise => {
    //   let date = new Date(exercise.date);
    //   let formattedDate = date.toString().slice(4, 10);
    //   if (showWeight) {
    //     return {x: formattedDate, y: exercise.weight};
    //   } else if (showMax) {
    //     return {x: formattedDate, y: exercise.maxRep};
    //   } else {
    //     return {x: formattedDate, y: (exercise.weight * exercise.reps)};
    //   }
    // });
    // setChartLogs(newData);
    const logs = [...list];
    let newLogs = logs.slice(0).map( exercise => {
      if (showWeight) {
        return exercise.weight;
      } else if (showMax) {
        return exercise.maxRep;
      } else {
        return exercise.weight * exercise.reps;
      }
    });
    let newDates = logs.slice(0).map( exercise => {
      let date = new Date(exercise.date);
      let formattedDate = date.toString().slice(4, 10);
      return formattedDate;
    });
    setChartLogs(newLogs);
    setChartDates(newDates);
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
          padding: 6,
          source: "auto"
        },
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
          padding: 6
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
    labels: chartDates,
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
      const res = await fetch(`/api/log/exercise/${exercise._id}`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      });
      const data = await res.json();
      if (data.isLoggedIn === false) {
        navigate("/");
        let loginText = "Your session has expired";
        handleNotif(loginText, true, true);
      }
      if (res.status === 200) {
        setFetchedLogs(data.data);
        createChartLogs(data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightClick = ()  => {
    setShowWeight(true);
    setShowMax(false);
    setRefetch(prev => !prev);
  };

  const handle1RMClick = ()  => {
    setShowWeight(false);
    setShowMax(true);
    setRefetch(prev => !prev);
  };

  const handleWorkloadClick = () => {
    setShowWeight(false);
    setShowMax(false);
    setRefetch(prev => !prev);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    createChartLogs(fetchedLogs);
  }, [refetch]);

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
            <div className="h-[40vh] mb-6">
              <Line 
                data={chartData}
                options={chartOptions}
              />
            </div>
            <div className="flex flex-col justify-start items-center w-full">
              <button 
                onClick={() => handleWeightClick()} 
                className={`w-full btn-lg mb-4 ${showWeight ? "btn-lg" : "btn-inverted-lg"}`}
              >Weight</button>
              <button  
                onClick={() => handle1RMClick()}
                className={`w-full btn-lg mb-4 ${showMax ? "btn-lg" : "btn-inverted-lg"}`}
              >1 Rep Max</button>
              <button  
                onClick={() => handleWorkloadClick()}
                className={`w-full btn-lg mb-4 ${(!showWeight && !showMax) ? "btn-lg" : "btn-inverted-lg"}`}
              >Workload</button>
            </div>
          </div>
      }
    </>
  );
}