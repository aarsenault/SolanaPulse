import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ISolBalance, getSolBalanceTop10 } from "../../services/api";
import { ApexOptions } from "apexcharts";
import { truncateAddress } from "../../utils/utils";

const HighGrowthAccountsPage: React.FC = () => {
  const [data, setData] = useState<ISolBalance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSolBalanceTop10();
        const data: ISolBalance[] = response.data;
        setData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data: ", error);
      }
    };

    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      width: "100%",
    },
    title: {
      text: "Sol Balances of Top Wallets",
      align: "center",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    fill: {
      colors: ["#ff7f50"],
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.map((item) => truncateAddress(item.address)),
      labels: {
        formatter: (value: string) => `${(parseInt(value) / 1e6).toFixed(0)} M`, // show in millions
      },
    },
    tooltip: {
      x: {
        // return the untruncated address in the tooltip. Ideally would put a link out to a chain explorere
        formatter: function (_, opts) {
          return data[opts.dataPointIndex].address;
        },
      },
    },
  };

  const series = [
    {
      name: "Sol Balance (USD)",
      data: data.map((item) => parseFloat(item.solBalance.toFixed(2))),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default HighGrowthAccountsPage;
