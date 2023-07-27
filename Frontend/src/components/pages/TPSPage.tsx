import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getTps } from "../../services/api";
import { ApexOptions } from "apexcharts";

export interface TPSData {
  tps: number;
  trueTps: number;
}

const TPSPage: React.FC = () => {
  const [data, setData] = useState<TPSData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTps();
        const data: TPSData = response.data;
        // Only push to the data array if both tps and trueTps are not undefined
        if (data.tps !== undefined && data.trueTps !== undefined) {
          setData((prevData) => [...prevData, data]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    // Fetch data every 10 seconds
    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 700,
      width: 700,
      toolbar: {
        show: false, // hide toolbar
      },
    },
    stroke: {
      curve: "stepline",
    },
    title: {
      text: "Solana's Transactions Per Second (TPS)",
      align: "center",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy hh:mm:ss",
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        formatter: (value: number) => value.toFixed(0),
      },
    },
    series: [
      {
        name: "TPS",
        data: data.map((item, index) => ({
          x: new Date().getTime() - (data.length - 1 - index) * 10000,
          y: item.tps,
        })),
        color: "#ff7f50",
      },
      {
        name: "True TPS",
        data: data.map((item, index) => ({
          x: new Date().getTime() - (data.length - 1 - index) * 10000,
          y: item.trueTps,
        })),
        color: "#ffd700",
      },
    ],
  };

  return (
    <div style={{ width: "80%", height: "80%" }}>
      <ReactApexChart
        options={options}
        series={options.series}
        type="line"
        height="100%"
      />
    </div>
  );
};

export default TPSPage;
